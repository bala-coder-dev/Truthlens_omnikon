export type VerdictType = 'Likely Authentic' | 'Suspicious' | 'Likely Manipulated';

export type MediaType = 'image' | 'video' | 'audio';

export interface ForensicBreakdown {
  lightingConsistency?: 'Consistent' | 'Anomalous' | 'Inconclusive';
  anatomicalAccuracy?: 'Natural' | 'Distorted' | 'Inconclusive';
  boundaryIntegrity?: 'Sharp & Seamless' | 'Blending Artifacts' | 'Inconclusive';
  generativeSignatures?: 'None Detected' | 'Diffusion/GAN Signatures Present' | 'Inconclusive';
  // Audio specific breakdowns
  vocalCadenceCoherence?: 'Natural Cadence' | 'Synthetic/Quantized' | 'Inconclusive';
  spectralPhaseContinuity?: 'Smooth Waveform' | 'Phase Glitches/Cutoffs' | 'Inconclusive';
  breathAcoustics?: 'Authentic Respiration' | 'Missing/Synthetic Breath' | 'Inconclusive';
  syntheticVocoderArtifacts?: 'None Detected' | 'Neural Vocoder Artifacts' | 'Inconclusive';
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  verdict: VerdictType;
  confidence: number;
  evidence: string[];
  summary: string;
  forensicBreakdown?: ForensicBreakdown;
  mediaPreview: string; // Base64 or URL or Audio URL
  mediaType: MediaType;
  fileName?: string;
  claimContext?: string;
  videoTimestamp?: number; // If from video frame capture
  audioDuration?: number;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  verdict: VerdictType;
  confidence: number;
  summary: string;
  mediaPreview: string;
  mediaType: MediaType;
  fileName?: string;
  evidence: string[];
  videoTimestamp?: number;
  audioDuration?: number;
}

export interface SampleMediaItem {
  id: string;
  title: string;
  mediaType: MediaType;
  category:
    | 'AI Generated'
    | 'Deepfake'
    | 'Deepfake Video'
    | 'Authentic'
    | 'Authentic Voice'
    | 'Authentic Video'
    | 'Diffusion Art'
    | 'Voice Clone';
  expectedVerdict: VerdictType;
  description: string;
  mediaUrl: string;
  claimContext?: string;
}
