import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Eye,
  Mic,
  Video,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  ExternalLink,
  ChevronRight,
  Layers,
  Lightbulb,
} from 'lucide-react';

interface LearnDeepfakesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample?: (sampleId: string) => void;
}

export const LearnDeepfakesModal: React.FC<LearnDeepfakesModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'auditory' | 'video' | 'checklist'>('visual');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-[0_0_50px_rgba(0,217,255,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E3A5F] bg-[#070D18]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Learn About Deepfakes & Synthetic Media
              </h2>
              <p className="text-xs text-slate-400">
                A field guide to identifying visual, auditory, and video generative artifacts
              </p>
            </div>
          </div>

          <button
            id="close-learn-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-[#112240] hover:bg-[#1E3A5F] text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-3 bg-[#070D18]/60 border-b border-[#1E3A5F] overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'visual'
                ? 'bg-[#00D9FF] text-[#0A192F] shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                : 'text-slate-300 hover:bg-[#112240]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Visual Artifacts (Images)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('auditory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'auditory'
                ? 'bg-[#00D9FF] text-[#0A192F] shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                : 'text-slate-300 hover:bg-[#112240]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Auditory Cues (Voice Clones)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'video'
                ? 'bg-[#00D9FF] text-[#0A192F] shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                : 'text-slate-300 hover:bg-[#112240]'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video & Lip-Sync Flaws</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'checklist'
                ? 'bg-[#00D9FF] text-[#0A192F] shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                : 'text-slate-300 hover:bg-[#112240]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Forensic Checklist</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
          {/* Tab 1: Visual Artifacts */}
          {activeTab === 'visual' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-[#112240]/80 border border-[#1E3A5F]">
                <h3 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00D9FF]" /> Key Visual Manipulation Signatures
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generative diffusion models (Midjourney, Stable Diffusion, Flux, DALL-E) render photorealistic imagery by hallucinating pixels. They struggle with high-frequency biological details, specular physics, and complex anatomy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>1. Inconsistent Cornea Specular Reflections</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    In authentic photos, both eyes reflect the exact same light sources. In AI deepfakes, the specular white dots inside left and right pupils often have different shapes, numbers, or angles.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>2. Plastic Skin Over-Smoothing & Missing Pores</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Diffusion models often smooth skin to a waxy, doll-like finish, wiping out micro-pores, fine peach fuzz, and natural micro-wrinkles around the eyes and forehead.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>3. Asymmetric Ears, Teeth & Eyeglasses</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Earlobes often bleed into the jawline, earrings mismatch, eyeglasses have disconnected frames, and teeth appear as an undivided white strip or have unrealistic counts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>4. Background Distortion & Gibberish Text</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Background architectural lines (window frames, tile grids) warp organically. Background signages and posters render as alien glyphs or unreadable pseudo-text.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Auditory Cues */}
          {activeTab === 'auditory' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-[#112240]/80 border border-[#1E3A5F]">
                <h3 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#00D9FF]" /> Identifying Voice Clones & Audio Deepfakes
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Voice cloning engines (ElevenLabs, Bark, VALL-E, XTTS) recreate timber and tone with astonishing accuracy, yet produce subtle acoustic and spectral flaws.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>1. Absence of Breath Mechanics & Micro-Pauses</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Real human speech requires diaphragm inhalation. AI voice clones frequently speak long, breathless paragraphs without natural respiration or saliva sounds.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>2. Neural Vocoder Phase Buzzing</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Listen closely to high-frequency sibilants ('s', 'sh', 'th'). Voice synthesis models generate a faint metallic buzzing, robotic chorus, or watery distortion in high frequencies.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>3. Quantized Cadence & Monotonic Pitch</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Text-to-speech models often exhibit rigid, metronome-like syllable spacing or artificial pitch modulation that fails to convey organic human emotional stress.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>4. Abrupt Background Reverb & Noise Floor Splicing</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    If an authentic voice is spliced with synthetic inserts, the room acoustics and background hiss will abruptly silence or switch tone during the cloned words.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Video & Lip-Sync Flaws */}
          {activeTab === 'video' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-[#112240]/80 border border-[#1E3A5F]">
                <h3 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#00D9FF]" /> Video Manipulation & Face-Swap Flaws
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Video deepfakes (Wav2Lip, DeepFaceLab, FaceFusion, LivePortrait) operate by warping facial meshes frame-by-frame, creating temporal inconsistencies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>1. Unnatural Blinking Cadence</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Humans blink naturally 15–20 times per minute. Early deepfakes failed to blink entirely, while modern ones often have half-blinks or irregular eyelid fluttering.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>2. Jawline Seam Bleeding & Border Halos</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When swapping faces, blending masks around the cheekbones, jaw, and neck create faint blurring halos or skin color jumps when the subject turns their head.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>3. Viseme / Phoneme Lip-Sync Mismatch</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Certain consonants (e.g. 'B', 'M', 'P') require complete lip closure (bilabial plosives). Lip-synced videos frequently miss full closure on these sounds.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B5C]" />
                    <span>4. Mouth Cavity Blurring & Tooth Glitches</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The inside of the mouth is difficult for AI to model in 3D. Inside the mouth cavity, teeth often flicker, lose individual separation, or blur into a dark gradient.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Forensic Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-[#112240]/80 border border-[#1E3A5F]">
                <h3 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00D9FF]" /> 5-Step Forensic Inspection Checklist
                </h3>
                <p className="text-xs text-slate-300">
                  Follow this quick heuristic checklist whenever evaluating suspicious viral media:
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: '1',
                    title: 'Zoom into the Eyes & Pupils',
                    desc: 'Check specular reflection coordinates in both eyes and look for pupil circularity deformation.',
                  },
                  {
                    step: '2',
                    title: 'Trace Boundaries & Necklines',
                    desc: 'Inspect the perimeter where the face meets the hair, ears, and shirt collar for soft blending blur.',
                  },
                  {
                    step: '3',
                    title: 'Check Biological Respiratory Dynamics',
                    desc: 'Listen for breath intakes, throat clearings, and natural pauses in speech audio.',
                  },
                  {
                    step: '4',
                    title: 'Scrub Video Frame-by-Frame',
                    desc: 'Pause during rapid head rotations to catch temporal face-mask detachment artifacts.',
                  },
                  {
                    step: '5',
                    title: 'Cross-Reference Source Provenance',
                    desc: 'Check reverse search, original creator attribution, and institutional verification metadata.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#070D18] border border-[#1E3A5F] flex items-start gap-3.5"
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#00D9FF]/20 text-[#00D9FF] font-mono text-sm font-bold flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-xs mb-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1E3A5F] bg-[#070D18] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lightbulb className="w-4 h-4 text-[#00D9FF]" />
            <span>Use TruthLens to automatically inspect these forensic layers in seconds</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A192F] font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,217,255,0.25)] hover:scale-105"
          >
            Got It, Back to Detector
          </button>
        </div>
      </div>
    </div>
  );
};
