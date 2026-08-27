import React from 'react';
import { History, Info, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { TruthLensLogo } from './TruthLensLogo';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onOpenHistory: () => void;
  onOpenLearn: () => void;
  onGoToUpload: () => void;
  historyCount: number;
  onReset: () => void;
  currentPage: 'landing' | 'upload' | 'analyzing' | 'result';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHowItWorks,
  onOpenHistory,
  onOpenLearn,
  onGoToUpload,
  historyCount,
  onReset,
  currentPage,
}) => {
  return (
    <header className="w-full border-b border-[#1E3A5F] bg-[#0A192F]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div
          id="brand-logo"
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="group-hover:scale-105 transition-transform">
            <TruthLensLogo size="md" showText={false} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                TRUTH<span className="text-[#00D9FF]">LENS</span>
              </span>
              <span className="hidden sm:inline-flex text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
                FORENSIC AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden md:block">
              VERIFY • ANALYZE • REVEAL
            </p>
          </div>
        </div>

        {/* Navigation Links & Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Learn About Deepfakes Guide */}
          <button
            id="nav-learn-deepfakes-btn"
            type="button"
            onClick={onOpenLearn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11263F] hover:bg-[#1E3A5F] text-slate-300 hover:text-white border border-[#1E3A5F] hover:border-[#00D9FF]/40 text-xs font-semibold transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span className="hidden sm:inline">Learn About Deepfakes</span>
            <span className="sm:hidden">Learn</span>
          </button>

          {/* How It Works */}
          <button
            id="how-it-works-btn"
            type="button"
            onClick={onOpenHowItWorks}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11263F] hover:bg-[#1E3A5F] text-slate-300 hover:text-white border border-[#1E3A5F] hover:border-[#00D9FF]/40 text-xs font-medium transition-all"
          >
            <Info className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>How It Works</span>
          </button>

          {/* History */}
          <button
            id="scan-history-btn"
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11263F] hover:bg-[#1E3A5F] text-slate-300 hover:text-white border border-[#1E3A5F] hover:border-[#00D9FF]/40 text-xs font-semibold transition-all"
          >
            <History className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span className="hidden xs:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#00D9FF] text-[#0A192F] font-bold text-[10px] leading-tight ml-0.5">
                {historyCount}
              </span>
            )}
          </button>

          {/* "Try Demo" CTA Button */}
          {currentPage === 'landing' ? (
            <button
              id="header-try-demo-btn"
              type="button"
              onClick={onGoToUpload}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A192F] font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:scale-105"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id="header-new-scan-btn"
              type="button"
              onClick={onGoToUpload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00D9FF]/20 hover:bg-[#00D9FF]/30 text-[#00D9FF] border border-[#00D9FF]/40 font-bold text-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Scan</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
