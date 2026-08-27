import React from 'react';
import { X, UploadCloud, ScanEye, CheckCircle2, ShieldAlert, Cpu, Sparkles, Layers, Eye, Zap } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="how-it-works-modal"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0A192F] border border-[#1E3A5F] rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-200"
      >
        {/* Close Button */}
        <button
          id="close-how-it-works-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-[#112240] hover:bg-[#1E3A5F] border border-[#1E3A5F] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF]">
            <ScanEye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              How TruthLens Detects Manipulated Media
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Multi-layered computer vision and multimodal reasoning architecture
            </p>
          </div>
        </div>

        {/* 3-Step Pipeline Banner */}
        <div className="mb-8 p-4 rounded-xl bg-[#112240] border border-[#1E3A5F]/80">
          <h3 className="text-xs uppercase tracking-widest text-[#00D9FF] font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" /> 3-Step Forensic Verification Pipeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="p-3.5 rounded-lg bg-[#0A192F] border border-[#1E3A5F] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#00D9FF] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/10">
                    STEP 01
                  </span>
                  <UploadCloud className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Ingest & Extract</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High-fidelity pixel ingestion. Video files are decomposed into sharp keyframe matrices for granular frame scrutiny.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-lg bg-[#0A192F] border border-[#00D9FF]/30 shadow-[0_0_15px_rgba(0,217,255,0.08)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#00D9FF] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/20">
                    STEP 02
                  </span>
                  <Cpu className="w-4 h-4 text-[#00D9FF]" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">AI Forensic Analysis</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gemini multimodal model inspects lighting physics, facial micro-symmetry, hair blending, and latent diffusion fingerprints.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-lg bg-[#0A192F] border border-[#1E3A5F] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-400/10">
                    STEP 03
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Explainable Verdict</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calibrated confidence rating, color-coded verdict, and concrete visual evidence points for transparent human verification.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Forensic Indicators Examined */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00D9FF]" /> Core Forensic Inspection Vectors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#112240]/60 border border-[#1E3A5F]">
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#00D9FF]" /> Specular Lighting & Cornea Reflections
              </div>
              <p className="text-slate-400">
                Natural optical captures show matching light reflections across both pupils. Generative models frequently mismatch light angles and reflection geometries.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#112240]/60 border border-[#1E3A5F]">
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#FF3B5C]" /> Anatomical & Facial Geometry
              </div>
              <p className="text-slate-400">
                Evaluation of earlobe contours, teeth alignment, finger count, and hair strand dissolution into backgrounds common in GANs and diffusion algorithms.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#112240]/60 border border-[#1E3A5F]">
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Skin Texture & Micropores
              </div>
              <p className="text-slate-400">
                Detects unnatural "plastic sheen", over-smoothing, or artificial airbrushed diffusion noise that lacks genuine dermal camera sensor noise.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#112240]/60 border border-[#1E3A5F]">
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Boundary Blending & Face-Swap Seams
              </div>
              <p className="text-slate-400">
                Searches for chromatic haloing, pixel warping, and edge feathering along the jawline and collar typical of deepfake face replacements.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1E3A5F] text-xs text-slate-400">
          <p>
            TruthLens provides forensic decision support. Always combine automated analysis with independent source verification.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#00D9FF] hover:bg-[#00c4e6] text-[#0A192F] font-semibold transition-colors"
          >
            Got it, Let's Analyze
          </button>
        </div>
      </div>
    </div>
  );
};
