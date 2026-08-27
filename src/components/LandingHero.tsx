import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Eye,
  FileCheck,
  Activity,
  Layers,
  CheckCircle2,
  Mic,
  Video,
  Image as ImageIcon,
  Zap,
} from 'lucide-react';
import { CyberParticleBackground } from './CyberParticleBackground';

interface LandingHeroProps {
  onStartScanning: () => void;
  onOpenLearn: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartScanning,
  onOpenLearn,
}) => {
  // Cycling verdict state for the animated mockup scan card
  const [mockVerdictIndex, setMockVerdictIndex] = useState<number>(0);

  const mockVerdicts = [
    {
      title: '94% Authentic',
      verdict: 'Likely Authentic',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      tag: 'OPTICAL SENSOR MATCH',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: '12% Authentic — Manipulated Detected',
      verdict: 'Likely Manipulated',
      badgeClass: 'bg-[#FF3B5C]/20 text-[#FF3B5C] border-[#FF3B5C]/40',
      tag: 'LATENT DIFFUSION ARTIFACT',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Voice Clone Clustered — Neural Vocoder',
      verdict: 'Likely Manipulated',
      badgeClass: 'bg-[#FF3B5C]/20 text-[#FF3B5C] border-[#FF3B5C]/40',
      tag: 'AUDIO SYNTHESIS DETECTED',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMockVerdictIndex((prev) => (prev + 1) % mockVerdicts.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const currentMock = mockVerdicts[mockVerdictIndex];

  // Animated stat counters
  const [stats, setStats] = useState({ count1: 0, count2: 0, count3: 0 });

  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out quad
      const eased = 1 - Math.pow(1 - progress, 3);

      setStats({
        count1: Math.round(eased * 8),
        count2: Number((eased * 6.5).toFixed(1)),
        count3: Number((eased * 24.5).toFixed(1)),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Cyber Canvas */}
      <CyberParticleBackground />

      {/* Main Hero Header Viewport */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11263F] border border-[#00D9FF]/30 text-xs font-semibold text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.15)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Deepfake & Synthetic Forensics</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              See Through the <span className="text-[#FF3B5C] drop-shadow-[0_0_25px_rgba(255,59,92,0.4)]">Fake.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Real-time, explainable deepfake detection for <span className="text-white font-semibold">video</span>, <span className="text-white font-semibold">image</span> & <span className="text-white font-semibold">voice</span>. Uncover synthetic manipulation, diffusion signatures, and neural speech cloning with forensic certainty.
            </p>

            {/* Multi-modal capabilities pill list */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A192F] border border-[#1E3A5F]">
                <ImageIcon className="w-4 h-4 text-[#00D9FF]" />
                <span>Image Artifacts</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A192F] border border-[#1E3A5F]">
                <Video className="w-4 h-4 text-[#00D9FF]" />
                <span>Video Keyframe Stepper</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A192F] border border-[#1E3A5F]">
                <Mic className="w-4 h-4 text-[#00D9FF]" />
                <span>Voice Clone Spectrogram</span>
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                id="hero-try-btn"
                type="button"
                onClick={onStartScanning}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A192F] font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-[0_0_30px_rgba(0,217,255,0.35)] hover:shadow-[0_0_40px_rgba(0,217,255,0.5)] hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Try TruthLens</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-learn-btn"
                type="button"
                onClick={onOpenLearn}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#11263F] hover:bg-[#1E3A5F] text-slate-200 border border-[#1E3A5F] font-semibold text-sm transition-all hover:scale-[1.02]"
              >
                <Eye className="w-4 h-4 text-[#00D9FF]" />
                <span>Learn About Deepfakes</span>
              </button>
            </div>

            {/* Animated Stat Counters */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#1E3A5F]/80 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {stats.count1}M+
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Deepfakes online in 2026</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#FF3B5C] font-mono">
                  {stats.count2}%
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Global fraud attempts</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#00D9FF] font-mono">
                  {stats.count3}%
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Human detection accuracy</div>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Visual Centerpiece Mock Scan Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-5 rounded-2xl bg-[#0A192F]/90 border border-[#1E3A5F] shadow-[0_0_50px_rgba(0,217,255,0.15)] backdrop-blur-md">
              {/* Corner Viewfinder Reticles */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00D9FF] rounded-tl" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00D9FF] rounded-tr" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00D9FF] rounded-bl" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00D9FF] rounded-br" />

              {/* Card Header Status */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1E3A5F] text-[11px] font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-ping" />
                  <span>TRUTHLENS SENSOR SCAN</span>
                </div>
                <span className="text-[#00D9FF] uppercase">{currentMock.tag}</span>
              </div>

              {/* Media Preview Box with Sweeping Cyan Scanline */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-[#1E3A5F] group">
                <img
                  src={currentMock.image}
                  alt="Forensic Scanning Sample"
                  className="w-full h-full object-cover transition-opacity duration-700"
                  crossOrigin="anonymous"
                />

                {/* Sweeping Laser Line Animation */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent shadow-[0_0_15px_#00D9FF] animate-laser-sweep pointer-events-none" />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                {/* Target Focus Reticle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-[#00D9FF]/40 rounded-full flex items-center justify-center pointer-events-none animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-[#00D9FF]" />
                </div>
              </div>

              {/* Cycling Dynamic Verdict Badge */}
              <div className="mt-4 p-3 rounded-xl bg-[#11263F] border border-[#1E3A5F] flex items-center justify-between gap-3 transition-all">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    CALIBRATED VERDICT
                  </span>
                  <div className="text-sm font-bold text-white tracking-tight">
                    {currentMock.title}
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold font-mono border transition-all ${currentMock.badgeClass}`}
                >
                  {currentMock.verdict}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" 3-Step Process Section */}
      <section className="relative z-10 border-t border-[#1E3A5F] bg-[#070D18]/90 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#00D9FF] font-bold">
              3-STAGE FORENSIC PIPELINE
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              How TruthLens Detects Manipulation
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Multimodal neural inspection dissecting visual physics, boundary geometry, and acoustic harmonics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Detect */}
            <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] hover:border-[#00D9FF]/50 transition-all hover:scale-[1.02] shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 flex items-center justify-center mb-4 group-hover:bg-[#00D9FF] group-hover:text-[#0A192F] transition-all">
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-mono text-[#00D9FF] font-bold uppercase mb-1">01. INGESTION</div>
              <h4 className="text-base font-bold text-white mb-2">Multi-Spectrum Ingestion</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload images, scrub video frame-by-frame, or feed audio recordings to extract high-frequency signals and optical features.
              </p>
            </div>

            {/* Step 2: Explain */}
            <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] hover:border-[#00D9FF]/50 transition-all hover:scale-[1.02] shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 flex items-center justify-center mb-4 group-hover:bg-[#00D9FF] group-hover:text-[#0A192F] transition-all">
                <Layers className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-mono text-[#00D9FF] font-bold uppercase mb-1">02. DEEP REASONING</div>
              <h4 className="text-base font-bold text-white mb-2">Explainable AI Evidence</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini analyzes specular corneal reflections, facial blend seams, background warping, and vocoder phase anomalies into actionable bullet points.
              </p>
            </div>

            {/* Step 3: Certify */}
            <div className="p-6 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] hover:border-[#00D9FF]/50 transition-all hover:scale-[1.02] shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 flex items-center justify-center mb-4 group-hover:bg-[#00D9FF] group-hover:text-[#0A192F] transition-all">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-mono text-[#00D9FF] font-bold uppercase mb-1">03. VERDICT</div>
              <h4 className="text-base font-bold text-white mb-2">Calibrated Score & Filters</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Obtain a clear confidence gauge, interactive edge/heatmap inspection filters, executive plain-language summary, and exportable forensic reports.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
