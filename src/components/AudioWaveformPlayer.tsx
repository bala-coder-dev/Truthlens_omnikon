import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Radio, Repeat, FastForward, Activity } from 'lucide-react';

interface AudioWaveformPlayerProps {
  audioSrc: string;
  fileName?: string;
  onDurationLoaded?: (duration: number) => void;
  className?: string;
}

export const AudioWaveformPlayer: React.FC<AudioWaveformPlayerProps> = ({
  audioSrc,
  fileName,
  onDurationLoaded,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [waveformBars, setWaveformBars] = useState<number[]>(() =>
    Array.from({ length: 48 }, () => Math.floor(Math.random() * 55) + 25)
  );

  // Extract real audio peaks using Web Audio API if possible
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setLoadError(null);

    let isCancelled = false;

    async function extractPeaks() {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const audioCtx = new AudioContextClass();
        let arrayBuffer: ArrayBuffer;

        if (audioSrc.startsWith('data:')) {
          // Convert data URI to ArrayBuffer
          const base64Str = audioSrc.split(',')[1];
          const binaryStr = atob(base64Str);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          arrayBuffer = bytes.buffer;
        } else {
          const res = await fetch(audioSrc);
          if (!res.ok) throw new Error('Could not fetch audio stream');
          arrayBuffer = await res.arrayBuffer();
        }

        const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        if (isCancelled) return;

        const channelData = decodedBuffer.getChannelData(0);
        const totalBars = 48;
        const blockSize = Math.floor(channelData.length / totalBars);
        const peaks: number[] = [];

        for (let i = 0; i < totalBars; i++) {
          let blockSum = 0;
          for (let j = 0; j < blockSize; j++) {
            blockSum += Math.abs(channelData[i * blockSize + j] || 0);
          }
          const avg = blockSum / blockSize;
          // Scale to percentage (20% to 100%)
          const barHeight = Math.min(100, Math.max(18, Math.round(avg * 280)));
          peaks.push(barHeight);
        }

        setWaveformBars(peaks);
        if (decodedBuffer.duration && onDurationLoaded) {
          setDuration(decodedBuffer.duration);
          onDurationLoaded(decodedBuffer.duration);
        }
      } catch (err) {
        console.warn('Peak extraction fallback to standard waveform:', err);
      }
    }

    if (audioSrc) {
      extractPeaks();
    }

    return () => {
      isCancelled = true;
    };
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Audio playback error:', e);
          setLoadError('Click to interact and enable audio playback.');
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (dur && !isNaN(dur) && isFinite(dur)) {
        setDuration(dur);
        if (onDurationLoaded) {
          onDurationLoaded(dur);
        }
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !isMuted;
      audioRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 0.75];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`p-4 rounded-xl bg-[#0A192F] border border-[#1E3A5F] shadow-lg ${className}`}>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (!isLooping) {
            setIsPlaying(false);
          }
        }}
        onError={(e) => {
          console.warn('HTML5 Audio loading warning:', e);
        }}
      />

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-1.5 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] flex-shrink-0">
            <Radio className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-[#00D9FF]' : 'text-slate-400'}`} />
          </div>
          <span className="text-xs font-mono text-slate-200 truncate font-semibold">
            {fileName || 'Acoustic Voice Stream'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-white font-bold">{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Live Interactive Waveform with Playhead */}
      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          if (audioRef.current && duration > 0) {
            const targetTime = ratio * duration;
            audioRef.current.currentTime = targetTime;
            setCurrentTime(targetTime);
          }
        }}
        className="relative h-16 bg-[#070D18] rounded-xl p-2.5 flex items-center justify-between gap-1 overflow-hidden border border-[#1E3A5F]/80 mb-3 cursor-pointer group hover:border-[#00D9FF]/50 transition-all"
        title="Click anywhere on waveform to seek"
      >
        {waveformBars.map((height, i) => {
          const barProgress = (i / waveformBars.length) * 100;
          const isPassed = barProgress <= progressPercent;

          return (
            <div key={i} className="flex-1 flex items-center justify-center h-full">
              <div
                style={{ height: `${height}%` }}
                className={`w-full max-w-[4px] rounded-full transition-all duration-150 ${
                  isPassed
                    ? isPlaying
                      ? 'bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]'
                      : 'bg-[#00D9FF]/80'
                    : 'bg-[#1E3A5F] group-hover:bg-[#1E3A5F]/80'
                }`}
              />
            </div>
          );
        })}

        {/* Audio Scanning Playhead Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_#FFF] transition-all pointer-events-none"
          style={{ left: `${Math.min(99.5, progressPercent)}%` }}
        />

        {/* Live Audio Activity Badge */}
        {isPlaying && (
          <div className="absolute top-1.5 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#00D9FF]/20 text-[#00D9FF] text-[9px] font-mono font-bold">
            <Activity className="w-2.5 h-2.5 animate-spin" />
            <span>STREAMING</span>
          </div>
        )}
      </div>

      {/* Progress Range Bar */}
      <input
        type="range"
        min="0"
        max={duration || 100}
        step="0.01"
        value={currentTime}
        onChange={handleSeek}
        className="w-full h-1.5 bg-[#1E3A5F] rounded-lg appearance-none cursor-pointer accent-[#00D9FF] mb-3"
      />

      {/* Primary Audio Transport Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {/* Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A192F] font-black text-xs transition-all shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Reset / Restart */}
          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
              }
            }}
            className="p-2 rounded-lg bg-[#112240] hover:bg-[#1E3A5F] text-slate-300 transition-all text-xs"
            title="Restart from beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Loop toggle */}
          <button
            type="button"
            onClick={toggleLoop}
            className={`p-2 rounded-lg transition-all text-xs ${
              isLooping
                ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                : 'bg-[#112240] hover:bg-[#1E3A5F] text-slate-400'
            }`}
            title={isLooping ? 'Looping enabled' : 'Loop disabled'}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          {/* Speed toggle */}
          <button
            type="button"
            onClick={cyclePlaybackRate}
            className="px-2 py-1 rounded-lg bg-[#112240] hover:bg-[#1E3A5F] text-slate-300 text-[11px] font-mono font-bold"
            title="Cycle Playback Speed"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-lg bg-[#112240] hover:bg-[#1E3A5F] text-slate-300 transition-all text-xs"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-[#FF3B5C]" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-[#1E3A5F] rounded-lg appearance-none cursor-pointer accent-[#00D9FF]"
            title="Volume Slider"
          />
        </div>
      </div>

      {loadError && (
        <div className="mt-2 text-[11px] text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/20 p-2 rounded-lg">
          {loadError}
        </div>
      )}
    </div>
  );
};
