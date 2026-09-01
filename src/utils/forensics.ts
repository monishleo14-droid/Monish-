// Client-side image forensics algorithms (ELA, Edge Gradient, Color Channel, FFT Spectrogram, Hasher)

/**
 * Compute SHA-256 hash of a file or string for tamper-evident forensic certificates
 */
export async function calculateSha256(data: ArrayBuffer | string): Promise<string> {
  let buffer: ArrayBuffer;
  if (typeof data === 'string') {
    buffer = new TextEncoder().encode(data);
  } else {
    buffer = data;
  }
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Perform Error Level Analysis (ELA) on an image
 * Resaves the image at a target JPEG quality (default 0.75),
 * computes pixel difference, and scales it by scaleFactor (default 15).
 */
export async function generateELAImage(
  imageSource: HTMLImageElement | string,
  quality: number = 0.75,
  scaleFactor: number = 15
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        const origCanvas = document.createElement('canvas');
        origCanvas.width = width;
        origCanvas.height = height;
        const origCtx = origCanvas.getContext('2d');
        if (!origCtx) return reject(new Error('Canvas 2D context not supported'));

        origCtx.drawImage(img, 0, 0, width, height);
        const origData = origCtx.getImageData(0, 0, width, height);

        // Recompress to JPEG at quality
        const jpegDataUrl = origCanvas.toDataURL('image/jpeg', quality);

        const compImg = new Image();
        compImg.onload = () => {
          const compCanvas = document.createElement('canvas');
          compCanvas.width = width;
          compCanvas.height = height;
          const compCtx = compCanvas.getContext('2d');
          if (!compCtx) return reject(new Error('Canvas 2D context not supported'));

          compCtx.drawImage(compImg, 0, 0, width, height);
          const compData = compCtx.getImageData(0, 0, width, height);

          // Output canvas for ELA visualization
          const elaCanvas = document.createElement('canvas');
          elaCanvas.width = width;
          elaCanvas.height = height;
          const elaCtx = elaCanvas.getContext('2d');
          if (!elaCtx) return reject(new Error('Canvas 2D context not supported'));

          const elaData = elaCtx.createImageData(width, height);
          const d1 = origData.data;
          const d2 = compData.data;
          const out = elaData.data;

          for (let i = 0; i < d1.length; i += 4) {
            const diffR = Math.abs(d1[i] - d2[i]) * scaleFactor;
            const diffG = Math.abs(d1[i + 1] - d2[i + 1]) * scaleFactor;
            const diffB = Math.abs(d1[i + 2] - d2[i + 2]) * scaleFactor;

            out[i] = Math.min(255, diffR);
            out[i + 1] = Math.min(255, diffG);
            out[i + 2] = Math.min(255, diffB);
            out[i + 3] = 255;
          }

          elaCtx.putImageData(elaData, 0, 0);
          resolve(elaCanvas.toDataURL('image/png'));
        };
        compImg.onerror = reject;
        compImg.src = jpegDataUrl;
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = reject;
    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = imageSource.src;
    }
  });
}

/**
 * Generate Laplacian High-Pass Edge & Sensor Noise Variance Map
 */
export async function generateNoiseVarianceMap(
  imageSource: HTMLImageElement | string,
  multiplier: number = 3.0
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failure'));

      ctx.drawImage(img, 0, 0, width, height);
      const src = ctx.getImageData(0, 0, width, height);
      const out = ctx.createImageData(width, height);

      const s = src.data;
      const d = out.data;

      // 3x3 Laplacian High-Pass Kernel
      // [ 0,  1,  0 ]
      // [ 1, -4,  1 ]
      // [ 0,  1,  0 ]
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;

          for (let c = 0; c < 3; c++) {
            const top = s[((y - 1) * width + x) * 4 + c];
            const bottom = s[((y + 1) * width + x) * 4 + c];
            const left = s[(y * width + (x - 1)) * 4 + c];
            const right = s[(y * width + (x + 1)) * 4 + c];
            const center = s[idx + c];

            const laplace = Math.abs(top + bottom + left + right - 4 * center);
            d[idx + c] = Math.min(255, Math.floor(laplace * multiplier + 15));
          }
          d[idx + 3] = 255;
        }
      }

      ctx.putImageData(out, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = reject;
    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = imageSource.src;
    }
  });
}

/**
 * Generate Color Channel Isolation (Red, Green, Blue, or Luminance Grayscale)
 */
export async function generateColorChannelMap(
  imageSource: HTMLImageElement | string,
  channel: 'red' | 'green' | 'blue' | 'luminance' | 'inverted'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failure'));

      ctx.drawImage(img, 0, 0, width, height);
      const src = ctx.getImageData(0, 0, width, height);
      const s = src.data;

      for (let i = 0; i < s.length; i += 4) {
        const r = s[i];
        const g = s[i + 1];
        const b = s[i + 2];

        if (channel === 'red') {
          s[i] = r;
          s[i + 1] = 0;
          s[i + 2] = 0;
        } else if (channel === 'green') {
          s[i] = 0;
          s[i + 1] = g;
          s[i + 2] = 0;
        } else if (channel === 'blue') {
          s[i] = 0;
          s[i + 1] = 0;
          s[i + 2] = b;
        } else if (channel === 'luminance') {
          const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          s[i] = lum;
          s[i + 1] = lum;
          s[i + 2] = lum;
        } else if (channel === 'inverted') {
          s[i] = 255 - r;
          s[i + 1] = 255 - g;
          s[i + 2] = 255 - b;
        }
      }

      ctx.putImageData(src, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = reject;
    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = imageSource.src;
    }
  });
}

/**
 * Extract keyframes from a video Blob at specified timestamps or count
 */
export async function extractVideoKeyframes(
  videoFileOrUrl: File | string,
  frameCount: number = 6
): Promise<Array<{ timestamp: number; imageBase64: string }>> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    const url = typeof videoFileOrUrl === 'string' ? videoFileOrUrl : URL.createObjectURL(videoFileOrUrl);
    video.src = url;

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration || 5;
        const interval = duration / (frameCount + 1);
        const frames: Array<{ timestamp: number; imageBase64: string }> = [];

        const canvas = document.createElement('canvas');
        canvas.width = Math.min(video.videoWidth || 640, 800);
        canvas.height = Math.min(video.videoHeight || 360, 450);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Canvas context error'));
        }

        for (let i = 1; i <= frameCount; i++) {
          const targetTime = i * interval;
          await new Promise<void>((res) => {
            video.currentTime = targetTime;
            video.onseeked = () => {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              frames.push({
                timestamp: parseFloat(targetTime.toFixed(2)),
                imageBase64: canvas.toDataURL('image/jpeg', 0.85),
              });
              res();
            };
          });
        }

        if (typeof videoFileOrUrl !== 'string') {
          URL.revokeObjectURL(url);
        }
        resolve(frames);
      } catch (e) {
        reject(e);
      }
    };

    video.onerror = (e) => reject(new Error('Could not load video metadata'));
  });
}

/**
 * Format bytes to readable size
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
