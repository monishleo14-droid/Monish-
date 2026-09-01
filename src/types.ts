export type MediaMode = 'image' | 'video' | 'audio' | 'camera' | 'text' | 'glossary';

export type DeepfakeVerdict = 'AUTHENTIC' | 'SUSPICIOUS' | 'SYNTHETIC_DEEPFAKE';

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export interface AnomalyRegion {
  id: string;
  label: string;
  category: 'facial_geometry' | 'lighting_shadow' | 'texture_skin' | 'eyes_specular' | 'teeth_mouth' | 'background_warp' | 'audio_artifact' | 'temporal_flicker';
  severity: 'low' | 'medium' | 'high' | 'critical';
  coordinates?: {
    x: number; // percentage 0-100
    y: number;
    width: number;
    height: number;
  };
  description: string;
  evidence: string;
}

export interface MetricScore {
  name: string;
  score: number; // 0 (definitely fake) to 100 (definitely authentic)
  weight: number;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  indicators: string[];
}

export interface ForensicAnalysisResult {
  id: string;
  timestamp: string;
  fileName: string;
  fileSizeFormatted: string;
  fileType: string;
  sha256Hash: string;
  verdict: DeepfakeVerdict;
  fakeProbability: number; // 0 to 100% chance it is fake
  authenticityScore: number; // 0 to 100% authentic
  confidence: ConfidenceLevel;
  summary: string;
  detailedAnalysis: string;
  modelUsed: string;
  metrics: MetricScore[];
  anomalies: AnomalyRegion[];
  technicalEvidence: {
    noisePatternConsistency: string;
    compressionArtifactDiscrepancy: string;
    lightingVectorConsistency: string;
    biologicalPlausibility: string;
    syntheticModelSignatures?: string[];
  };
  recommendations: string[];
  metadataInfo?: {
    dimensions?: string;
    colorSpace?: string;
    software?: string;
    creationDate?: string;
    hasC2PASignature?: boolean;
    exifNotes?: string;
  };
}

export interface SampleMediaItem {
  id: string;
  title: string;
  category: 'image' | 'audio' | 'video';
  type: 'deepfake' | 'authentic';
  description: string;
  thumbnail: string;
  mediaUrl: string;
  sampleType: 'face_swap' | 'diffusion_ai' | 'gan_portrait' | 'voice_clone' | 'real_photo' | 'real_voice';
  preloadedResult: ForensicAnalysisResult;
}

export interface VideoFrameAnalysis {
  frameIndex: number;
  timestamp: number;
  imageDataUrl: string;
  anomalyScore: number; // 0-100 fake score
  facialBoundarySharpness: number;
  blinkDetected: boolean;
  notes: string;
}
