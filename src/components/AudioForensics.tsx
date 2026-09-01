import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Activity,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Volume2,
  Sparkles
} from 'lucide-react';
import { SAMPLE_MEDIA_ITEMS } from '../data/sampleData';

export const AudioForensics: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string>(
    SAMPLE_MEDIA_ITEMS.find((s) => s.category === 'audio')?.mediaUrl || ''
  );
  const [fileName, setFileName] = useState<string>('neural_voice_clone_leak.mp3');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(
    SAMPLE_MEDIA_ITEMS.find((s) => s.category === 'audio')?.preloadedResult || null
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Setup Web Audio API and Real-Time Spectrogram / Frequency Bar Visualizer
  const setupAudioContext = () => {
    if (!audioRef.current || audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch (e) {
      console.warn('Web Audio API setup error:', e);
    }
  };

  const drawSpectrogram = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(2, 6, 23, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      const hue = (i / bufferLength) * 280 + 160; // Cyan to Purple colormap

      ctx.fillStyle = `hsl(${hue}, 100%, ${Math.min(75, 25 + dataArray[i] / 4)}%)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }

    // Draw 11kHz Brickwall cutoff reference line
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const cutoffX = canvas.width * 0.55; // Approx 11kHz
    ctx.moveTo(cutoffX, 0);
    ctx.lineTo(cutoffX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f43f5e';
    ctx.font = '10px monospace';
    ctx.fillText('11.2 kHz Cutoff', cutoffX + 4, 15);

    animationFrameRef.current = requestAnimationFrame(drawSpectrogram);
  };

  useEffect(() => {
    if (isPlaying) {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      drawSpectrogram();
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setupAudioContext();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioUpload = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an MP3, WAV, or WebM audio file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setAudioUrl(dataUrl);
      setFileName(file.name);
      analyzeAudio(dataUrl, file.name, file.type);
    };
    reader.readAsDataURL(file);
  };

  const analyzeAudio = async (base64Audio: string, name: string, mime: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          fileName: name,
          mimeType: mime,
        }),
      });
      if (!response.ok) throw new Error('Audio analysis failed');
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Audio analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Voice Clone & Acoustic Forensics</span>
                {isAnalyzing && (
                  <span className="flex items-center gap-1 text-xs font-normal text-purple-400 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing voice acoustics with Gemini...
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Detects neural vocoder phase glitches, 11kHz brickwall frequency truncation, and lack of biological breathing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0])}
              accept="audio/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm transition active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Audio Sample</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Spectrogram & Audio Player (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Real-Time FFT Spectrogram Waterfall
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">0 Hz - 24,000 Hz</span>
            </div>

            {/* Spectrogram Canvas */}
            <div className="relative w-full h-64 bg-slate-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={700}
                height={260}
                className="w-full h-full object-cover"
              />
              {!isPlaying && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/30 transition transform hover:scale-105 active:scale-95"
                  >
                    <Play className="w-6 h-6 ml-0.5" />
                  </button>
                  <span className="text-xs text-slate-300 font-medium">Click to Play & Stream Spectrogram</span>
                </div>
              )}
            </div>

            {/* Audio Controls */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
              <audio
                ref={audioRef}
                src={audioUrl}
                crossOrigin="anonymous"
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                onEnded={() => setIsPlaying(false)}
              />

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.05"
                  value={currentTime}
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Number(e.target.value);
                      setCurrentTime(Number(e.target.value));
                    }
                  }}
                  className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                  {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime = 0;
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                  {fileName}
                </div>
              </div>
            </div>
          </div>

          {/* Acoustic Diagnostic Signs */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Key Neural Voice Clone Fingerprints
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="font-semibold text-purple-300">1. Brickwall Frequency Cutoff</div>
                <p className="text-slate-400 text-[11px]">
                  Fast neural vocoders (HiFi-GAN) truncate sharply above 11kHz or 16kHz to reduce inference latency.
                </p>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="font-semibold text-purple-300">2. Absence of Inhalation</div>
                <p className="text-slate-400 text-[11px]">
                  AI speech engines generate continuous phonemes without human pulmonary breathing pauses or micro-clicks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Forensic Assessment (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {analysisResult && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Voice Biometrics Diagnosis
                </span>
                {analysisResult.verdict === 'SYNTHETIC_DEEPFAKE' ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-xs">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>SYNTHETIC VOICE CLONE</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>AUTHENTIC HUMAN VOICE</span>
                  </div>
                )}
              </div>

              {/* Meters */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-[11px] text-slate-400 font-medium">Clone Probability</div>
                  <div className="text-2xl font-black font-mono text-rose-400 mt-1">
                    {analysisResult.fakeProbability}%
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-[11px] text-slate-400 font-medium">Biological Score</div>
                  <div className="text-2xl font-black font-mono text-slate-300 mt-1">
                    {analysisResult.authenticityScore}%
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                  Acoustic Forensics Summary
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{analysisResult.summary}</p>
              </div>

              {/* Voice Metrics */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Acoustic Feature Scores
                </div>
                <div className="space-y-2">
                  {analysisResult.voiceMetrics?.map((m: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{m.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                            m.status === 'pass'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : m.status === 'warning'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {m.score}/100
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.score >= 70 ? 'bg-emerald-400' : m.score >= 40 ? 'bg-amber-400' : 'bg-rose-500'
                          }`}
                          style={{ width: `${m.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
