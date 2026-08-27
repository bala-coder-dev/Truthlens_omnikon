import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Eye, Layers, ZoomIn, Sun, Flame, Sparkles } from 'lucide-react';

export type FilterMode = 'normal' | 'highpass' | 'invert' | 'heatmap';

interface ForensicFilterCanvasProps {
  imageSrc: string;
  verdictCoral?: boolean;
}

export const ForensicFilterCanvas: React.FC<ForensicFilterCanvasProps> = ({
  imageSrc,
  verdictCoral = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterMode>('normal');
  const [isMagnifierActive, setIsMagnifierActive] = useState<boolean>(false);
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number; relX: number; relY: number }>({
    x: 0,
    y: 0,
    relX: 0.5,
    relY: 0.5,
  });
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Load Image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      imageObjRef.current = img;
      setImgLoaded(true);
      applyFilter(activeFilter);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Apply Pixel Filters to Canvas
  const applyFilter = useCallback((filter: FilterMode) => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 600;

    // Draw base image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (filter === 'normal') return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = canvas.width;
    const h = canvas.height;

    if (filter === 'invert') {
      // Invert luminance & solarize to reveal hidden reflection/lighting inconsistencies
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filter === 'heatmap') {
      // Noise / Gradient Thermal Heatmap
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        // Map luminance to thermal rainbow: Blue -> Cyan -> Yellow -> Red -> White
        if (lum < 64) {
          data[i] = 0;
          data[i + 1] = Math.round((lum / 64) * 255);
          data[i + 2] = 255;
        } else if (lum < 128) {
          data[i] = 0;
          data[i + 1] = 255;
          data[i + 2] = Math.round(255 - ((lum - 64) / 64) * 255);
        } else if (lum < 192) {
          data[i] = Math.round(((lum - 128) / 64) * 255);
          data[i + 1] = 255;
          data[i + 2] = 0;
        } else {
          data[i] = 255;
          data[i + 1] = Math.round(255 - ((lum - 192) / 64) * 180);
          data[i + 2] = Math.round(((lum - 192) / 64) * 120);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (filter === 'highpass') {
      // High Pass / Edge Convolution for seam detection
      const output = ctx.createImageData(w, h);
      const outData = output.data;
      const grayData = new Float32Array(w * h);

      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        grayData[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }

      // Laplacian kernel [0, 1, 0, 1, -4, 1, 0, 1, 0]
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x;
          const val =
            grayData[idx - w] +
            grayData[idx - 1] -
            4 * grayData[idx] +
            grayData[idx + 1] +
            grayData[idx + w];

          const edge = Math.min(255, Math.max(0, 128 + val * 2.5));
          const outIdx = (y * w + x) * 4;
          outData[outIdx] = edge;     // R
          outData[outIdx + 1] = edge; // G
          outData[outIdx + 2] = edge; // B
          outData[outIdx + 3] = 255;  // A
        }
      }
      ctx.putImageData(output, 0, 0);
    }
  }, []);

  useEffect(() => {
    if (imgLoaded) {
      applyFilter(activeFilter);
    }
  }, [activeFilter, imgLoaded, applyFilter]);

  // Handle Mouse Move for 2.5x Magnifier
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const relX = Math.max(0, Math.min(1, x / rect.width));
    const relY = Math.max(0, Math.min(1, y / rect.height));

    setMagnifierPos({ x, y, relX, relY });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Filter Mode Selector Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[#0A192F] border border-[#1E3A5F]">
        <div className="flex items-center gap-1 text-xs text-slate-300 font-medium px-2">
          <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span className="hidden sm:inline">Forensic Inspector View:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            id="filter-normal-btn"
            onClick={() => setActiveFilter('normal')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'normal'
                ? 'bg-[#00D9FF] text-[#0A192F] font-semibold shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                : 'bg-[#112240] text-slate-300 hover:text-white hover:bg-[#1E3A5F]'
            }`}
          >
            <Eye className="w-3 h-3" /> Normal
          </button>

          <button
            type="button"
            id="filter-highpass-btn"
            onClick={() => setActiveFilter('highpass')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'highpass'
                ? 'bg-[#00D9FF] text-[#0A192F] font-semibold shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                : 'bg-[#112240] text-slate-300 hover:text-white hover:bg-[#1E3A5F]'
            }`}
            title="Laplacian Edge Filter highlights seam boundaries & hair artifacts"
          >
            <Layers className="w-3 h-3" /> Edge Seams
          </button>

          <button
            type="button"
            id="filter-heatmap-btn"
            onClick={() => setActiveFilter('heatmap')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'heatmap'
                ? 'bg-[#00D9FF] text-[#0A192F] font-semibold shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                : 'bg-[#112240] text-slate-300 hover:text-white hover:bg-[#1E3A5F]'
            }`}
            title="Thermal Heatmap isolates noise frequency inconsistencies"
          >
            <Flame className="w-3 h-3" /> Heatmap
          </button>

          <button
            type="button"
            id="filter-invert-btn"
            onClick={() => setActiveFilter('invert')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'invert'
                ? 'bg-[#00D9FF] text-[#0A192F] font-semibold shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                : 'bg-[#112240] text-slate-300 hover:text-white hover:bg-[#1E3A5F]'
            }`}
            title="Inverted Luminance highlights specular pupil highlights"
          >
            <Sun className="w-3 h-3" /> Solarize
          </button>

          <button
            type="button"
            id="toggle-magnifier-btn"
            onClick={() => setIsMagnifierActive(!isMagnifierActive)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
              isMagnifierActive
                ? 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]'
                : 'bg-[#112240] text-slate-300 border-transparent hover:text-white hover:bg-[#1E3A5F]'
            }`}
          >
            <ZoomIn className="w-3 h-3" /> 2.5x Lens {isMagnifierActive ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Canvas & Inspection Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => isMagnifierActive && setIsMagnifierActive(true)}
        className="relative w-full rounded-xl overflow-hidden bg-black/80 border border-[#1E3A5F] flex items-center justify-center min-h-[280px] max-h-[480px] cursor-crosshair select-none"
      >
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[460px] object-contain rounded-lg shadow-inner"
        />

        {/* Dynamic Scan / Grid Overlay Elements */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(10,25,47,0.4)_100%)]" />

        {/* Corner Reticle Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00D9FF]/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00D9FF]/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00D9FF]/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00D9FF]/60 pointer-events-none" />

        {/* Active Filter Mode Tag */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#0A192F]/80 backdrop-blur-sm border border-[#1E3A5F] text-[10px] font-mono text-[#00D9FF] uppercase tracking-wider pointer-events-none">
          LAYER: {activeFilter.toUpperCase()}
        </div>

        {/* 2.5x Zoom Magnifier Loupe */}
        {isMagnifierActive && (
          <div
            className="absolute pointer-events-none w-32 h-32 rounded-full border-2 border-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.6)] overflow-hidden bg-black/90 z-20"
            style={{
              left: `${magnifierPos.x - 64}px`,
              top: `${magnifierPos.y - 64}px`,
            }}
          >
            {/* Magnified Image */}
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundPosition: `${magnifierPos.relX * 100}% ${magnifierPos.relY * 100}%`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat',
              }}
            />
            {/* Center Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-full h-[1px] bg-[#00D9FF]" />
              <div className="absolute h-full w-[1px] bg-[#00D9FF]" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>
          {activeFilter === 'normal' && 'Standard optical view.'}
          {activeFilter === 'highpass' && 'Edge filter: check for sharp halos around hair, face, and collar seams.'}
          {activeFilter === 'heatmap' && 'Thermal noise: uneven noise gradients indicate composite patching.'}
          {activeFilter === 'invert' && 'Solarize view: check if pupil specular reflection highlights align.'}
        </span>
        {isMagnifierActive && <span className="text-[#00D9FF] font-mono">Move cursor to magnify</span>}
      </div>
    </div>
  );
};
