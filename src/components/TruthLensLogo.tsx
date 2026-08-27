import React from 'react';

interface TruthLensLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  useImage?: boolean;
}

export const TruthLensLogo: React.FC<TruthLensLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
  useImage = false,
}) => {
  const sizeConfig = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[8px]', gap: 'gap-2' },
    md: { icon: 38, text: 'text-xl', sub: 'text-[9px]', gap: 'gap-2.5' },
    lg: { icon: 56, text: 'text-2xl sm:text-3xl', sub: 'text-[10px]', gap: 'gap-3' },
    xl: { icon: 84, text: 'text-4xl sm:text-5xl', sub: 'text-xs', gap: 'gap-4' },
  }[size];

  // If useImage is true or rendered as standalone graphic banner
  if (useImage) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img
          src="/truthlens-logo.jpg"
          alt="TruthLens Logo"
          className="rounded-2xl border border-[#00D9FF]/40 shadow-[0_0_30px_rgba(0,217,255,0.25)] object-contain"
          style={{ width: sizeConfig.icon * 3, height: sizeConfig.icon * 3 }}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${sizeConfig.gap} ${className}`}>
      {/* Vector Emblem: Magnifying Glass + Intertwined TL + Cyber Data Streaks */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center"
        style={{ width: sizeConfig.icon, height: sizeConfig.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_10px_rgba(0,217,255,0.4)]"
        >
          {/* Definitions for Gradients & Glow */}
          <defs>
            <linearGradient id="lensRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#00D9FF" />
              <stop offset="100%" stopColor="#0088CC" />
            </linearGradient>

            <linearGradient id="cyanStreak" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D9FF" />
              <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="lensGlass" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#070D18" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Internal Lens Background */}
          <circle cx="46" cy="44" r="30" fill="url(#lensGlass)" />
          
          {/* Specular Inner Glare Arc */}
          <path
            d="M 24 35 A 24 24 0 0 1 48 20"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Outer Lens Ring */}
          <circle
            cx="46"
            cy="44"
            r="30"
            stroke="url(#lensRingGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Cyber Data Streaks extending to the right */}
          {/* Streak 1 */}
          <line x1="68" y1="34" x2="88" y2="34" stroke="#00D9FF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="93" cy="34" r="1.5" fill="#00D9FF" />

          {/* Streak 2 */}
          <line x1="72" y1="42" x2="85" y2="42" stroke="#00D9FF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Streak 3 */}
          <line x1="70" y1="50" x2="90" y2="50" stroke="#00D9FF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="95" cy="50" r="1.5" fill="#00D9FF" />

          {/* Streak 4 */}
          <line x1="62" y1="58" x2="78" y2="58" stroke="#00D9FF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Intertwined 'T' (White) & 'L' (Electric Cyan) */}
          {/* T Top Bar */}
          <path
            d="M 28 32 L 54 32"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* T Vertical Stem */}
          <path
            d="M 41 32 L 41 57"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Intertwined L (Cyan) Stem & Base */}
          <path
            d="M 52 34 L 52 56 L 68 56"
            stroke="#00D9FF"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Magnifying Glass Diagonal Handle (Cyan & White) */}
          <line
            x1="66"
            y1="64"
            x2="84"
            y2="82"
            stroke="#00D9FF"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          {/* Handle Core highlight */}
          <line
            x1="70"
            y1="68"
            x2="80"
            y2="78"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Typography Section */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center">
            <span className={`font-black tracking-tight text-white leading-none ${sizeConfig.text}`}>
              TRUTH
            </span>
            <span className={`font-black tracking-tight text-[#00D9FF] leading-none ml-1 ${sizeConfig.text}`}>
              LENS
            </span>
          </div>

          {showTagline && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`font-mono uppercase tracking-widest text-slate-400 font-semibold ${sizeConfig.sub}`}>
                VERIFY
              </span>
              <span className="text-[#00D9FF] text-[8px]">•</span>
              {/* Shield Mini Icon */}
              <svg className="w-2.5 h-2.5 text-[#00D9FF]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" fillOpacity="0.2" stroke="#00D9FF" strokeWidth="2" />
                <path d="M9 12L11 14L15 10" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[#00D9FF] text-[8px]">•</span>
              <span className={`font-mono uppercase tracking-widest text-[#00D9FF] font-semibold ${sizeConfig.sub}`}>
                ANALYZE
              </span>
              <span className="text-[#00D9FF] text-[8px]">•</span>
              <span className={`font-mono uppercase tracking-widest text-slate-400 font-semibold ${sizeConfig.sub}`}>
                REVEAL
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
