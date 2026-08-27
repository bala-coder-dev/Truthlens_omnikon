import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, Radio, Sparkles, Eye, Mic, Video } from 'lucide-react';
import { MediaType } from '../types';

interface AnalyzingScannerProps {
  mediaPreview: string;
  mediaType: MediaType;
  claimContext?: string;
  videoTimestamp?: number;
}

export const AnalyzingScanner: React.FC<AnalyzingScannerProps> = ({
  mediaPreview,
  mediaType,
  claimContext,
  videoTimestamp,
}) => {
  const [statusIndex, setStatusIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(10);

  const visualStatusSteps = [
    'Extracting visual features & high-frequency sensor noise…',
    'Checking lighting & specular corneal reflections…',
    'Analyzing facial geometry, ears, teeth & hands…',
    'Inspecting boundary seams, edge feathering & halos…',
    'Cross-referencing diffusion & GAN generative signatures…',
    'Synthesizing explainable forensic evidence…',
  ];

  const audioStatusSteps = [
    'Ingesting acoustic frequency spectrum & phase floor…',
    'Analyzing vocal cadence, prosody & pitch quantization…',
    'Inspecting respiration dynamics & background noise floor…',
    'Detecting neural vocoder phase buzzing & cloning signatures…',
    'Synthesizing explainable acoustic evidence…',
  ];

  const activeSteps = mediaType === 'audio' ? audioStatusSteps : visualStatusSteps;

  // Rotate status message every 1.2s as specified
  useEffect(() => {
    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % activeSteps.length);
    }, 1200);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return 94;
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 450);

    return () => {
      clearInterval(statusTimer);
      clearInterval(progressTimer);
    };
  }, [activeSteps.length]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Diagnostic Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A192F] border border-[#1E3A5F] text-xs font-mono">
        <div className="flex items-center gap-2 text-[#00D9FF]">
          <Activity className="w-4 h-4 animate-spin text-[#00D9FF]" />
          <span className="font-bold uppercase tracking-wider">
            {mediaType === 'audio' ? 'ACOUSTIC FORENSIC PIPELINE' : 'NEURAL OPTICAL SCANNER'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-ping" />
          <span>GEMINI MULTIMODAL INFERENCE</span>
        </div>
      </div>

      {/* Centerpiece Media Scanning Container */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-[#00D9FF]/40 shadow-[0_0_40px_rgba(0,217,255,0.2)] p-2">
        {/* Visual Inspection View (Image or Video Keyframe) */}
        {mediaType !== 'audio' ? (
          <div className="relative aspect-[16/10] max-h-[420px] w-full rounded-xl overflow-hidden bg-[#070D18] flex items-center justify-center">
            <img
              src={mediaPreview}
              alt="Scanning Target"
              className="w-full h-full object-contain filter contrast-105"
            />

            {/* Cyan Sweeping Laser Line Animation */}
            <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent shadow-[0_0_20px_#00D9FF] animate-laser-sweep pointer-events-none" />

            {/* Viewfinder Corner Overlays */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#00D9FF] pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#00D9FF] pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#00D9FF] pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#00D9FF] pointer-events-none" />

            {/* Face / Feature Reticle Box */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border border-[#00D9FF]/40 rounded-xl flex items-center justify-center pointer-events-none animate-pulse">
              <div className="w-3 h-3 rounded-full bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]" />
            </div>

            {/* Video Timestamp Pill if applicable */}
            {videoTimestamp !== undefined && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 backdrop-blur border border-[#00D9FF]/40 text-[#00D9FF] text-[11px] font-mono font-bold">
                KEYFRAME: {videoTimestamp}s
              </div>
            )}
          </div>
        ) : (
          /* Audio Inspection Soundwave Centerpiece */
          <div className="relative aspect-[16/10] max-h-[380px] w-full rounded-xl overflow-hidden bg-[#070D18] flex flex-col items-center justify-center p-8 space-y-6 border border-[#1E3A5F]">
            {/* Center Pulsing Audio Radar */}
            <div className="relative flex items-center justify-center w-28 h-28">
              <div className="absolute inset-0 rounded-full border-2 border-[#00D9FF]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-[#00D9FF]/40 animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] shadow-[0_0_25px_rgba(0,217,255,0.4)]">
                <Mic className="w-8 h-8" />
              </div>
            </div>

            {/* Dynamic Sound Waveform Bars */}
            <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-md">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#00D9FF] rounded-full animate-pulse"
                  style={{
                    height: `${Math.floor(Math.sin(i * 0.4 + statusIndex) * 35 + 45)}%`,
                    animationDuration: `${0.6 + (i % 5) * 0.15}s`,
                  }}
                />
              ))}
            </div>

            <div className="text-center">
              <div className="text-xs font-mono text-[#00D9FF] font-bold">
                SPECTRAL ACOUSTIC DECOMPOSITION
              </div>
              <div className="text-[11px] text-slate-400">
                Evaluating vocal harmonics & neural vocoder signatures
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Rotating Status Message (Changes every ~1.2s) */}
      <div className="p-4 rounded-xl bg-[#0A192F] border border-[#1E3A5F] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">STATUS:</span>
          <span className="text-[#00D9FF] font-mono font-bold">{progress}%</span>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-1.5 w-full bg-[#11263F] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00D9FF]/50 to-[#00D9FF] transition-all duration-300 ease-out shadow-[0_0_10px_#00D9FF]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Status Text */}
        <div className="flex items-center gap-2.5 pt-1 text-xs sm:text-sm font-semibold text-white">
          <Sparkles className="w-4 h-4 text-[#00D9FF] animate-spin" />
          <span className="transition-all duration-300">{activeSteps[statusIndex]}</span>
        </div>
      </div>
    </div>
  );
};
