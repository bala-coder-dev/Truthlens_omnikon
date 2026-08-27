// Generates valid playable 16-bit PCM WAV audio data URIs for instant offline demo benchmarks

export function generateSyntheticVoiceWav(durationSec = 4): string {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new Float32Array(numSamples);

  // Synthesize a synthetic / AI robotic vocoder voice pattern
  // Characteristics: Fixed fundamental frequency (175Hz), heavy buzz harmonics, no natural breath, sudden gating
  const f0 = 175; // robotic flat pitch
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Simulate words with robotic syllable gating (3 syllables per second)
    const syllableGate = Math.sin(t * 3 * Math.PI * 2);
    if (syllableGate > 0.1) {
      // Harmonic buzz (Vocoder simulation: 1st, 2nd, 3rd, 5th, 8th harmonics with high phase rigidity)
      const osc1 = Math.sin(2 * Math.PI * f0 * t);
      const osc2 = 0.5 * Math.sin(2 * Math.PI * (f0 * 2) * t);
      const osc3 = 0.3 * Math.sin(2 * Math.PI * (f0 * 3) * t);
      const osc4 = 0.25 * Math.sin(2 * Math.PI * (f0 * 4) * t);
      const osc5 = 0.2 * Math.sin(2 * Math.PI * (f0 * 5) * t);
      // High frequency vocoder quantization artifact (>8kHz chirp)
      const hfArtifact = 0.08 * Math.sin(2 * Math.PI * 8500 * t);

      // Formant filtering envelope simulation
      const formant = Math.sin(2 * Math.PI * 700 * t) * 0.4 + Math.sin(2 * Math.PI * 1800 * t) * 0.2;
      
      const rawVoice = (osc1 + osc2 + osc3 + osc4 + osc5 + hfArtifact) * (0.6 + formant);
      // Sudden robotic cut envelope (no biological decay)
      buffer[i] = Math.max(-1, Math.min(1, rawVoice * 0.4));
    } else {
      // Total dead digital silence between phonemes (hallmark of synthetic audio)
      buffer[i] = 0;
    }
  }

  return encodeWav(buffer, sampleRate);
}

export function generateAuthenticVoiceWav(durationSec = 4.5): string {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new Float32Array(numSamples);

  // Synthesize an organic human voice pattern
  // Characteristics: Organic pitch vibrato/jitter (120-135Hz), warm chest resonance, subtle continuous room acoustic floor, soft breath intakes
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Organic pitch contour with micro-inflections and natural intonation curve
    const pitchContour = 125 + Math.sin(t * 1.5) * 8 + Math.sin(t * 7.2) * 2.5;
    
    // Syllable rhythm with smooth exponential breath onsets and decays
    const phraseEnv = Math.max(0, Math.sin(t * 2.2 * Math.PI) * 0.5 + 0.5);
    
    // Natural vocal tract formants
    const f1 = Math.sin(2 * Math.PI * pitchContour * t);
    const f2 = 0.4 * Math.sin(2 * Math.PI * (pitchContour * 2) * t);
    const f3 = 0.25 * Math.sin(2 * Math.PI * (pitchContour * 3) * t);
    const fChest = 0.35 * Math.sin(2 * Math.PI * 450 * t); // Chest warmth

    // Biological breath & ambient room noise floor (continuous pink/white noise)
    const ambientNoise = (Math.random() * 2 - 1) * 0.015;
    const breathIntake = (t < 0.4 || (t > 2.0 && t < 2.3)) ? (Math.random() * 2 - 1) * 0.04 : 0;

    const speechSignal = (f1 + f2 + f3 + fChest) * Math.pow(phraseEnv, 1.4) * 0.45;
    buffer[i] = Math.max(-1, Math.min(1, speechSignal + ambientNoise + breathIntake));
  }

  return encodeWav(buffer, sampleRate);
}

// Generates an animated test video WebM/MP4 data URI or returns reliable video sample URLs
export function getSampleVideoUrl(type: 'deepfake' | 'authentic'): string {
  if (type === 'deepfake') {
    // Reliable high-speed open test stream
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  } else {
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4';
  }
}

function encodeWav(samples: Float32Array, sampleRate: number): string {
  const byteRate = sampleRate * 2;
  const blockAlign = 2;
  const dataSize = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size for PCM
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true); // NumChannels (Mono)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM 16-bit audio samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  // Convert ArrayBuffer to base64
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
