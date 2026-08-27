import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Mic,
  MicOff,
  Link as LinkIcon,
  Sparkles,
  AlertCircle,
  FileSearch,
  CheckCircle2,
  Play,
  Pause,
  Scissors,
  RotateCcw,
  StepForward,
  StepBack,
  Volume2,
  Radio,
  FileAudio,
  FileVideo,
  Info,
} from 'lucide-react';
import { MediaType } from '../types';
import { SAMPLE_MEDIA } from '../sampleData';
import { AudioWaveformPlayer } from './AudioWaveformPlayer';

interface MediaUploaderProps {
  onAnalyze: (payload: {
    mediaBase64: string;
    mimeType: string;
    claimContext?: string;
    mediaType: MediaType;
    fileName?: string;
    videoTimestamp?: number;
    audioDuration?: number;
  }) => void;
  isLoading: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<MediaType>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [claimContext, setClaimContext] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Video specific states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [capturedFrameBase64, setCapturedFrameBase64] = useState<string | null>(null);
  const [videoPlaybackError, setVideoPlaybackError] = useState<string | null>(null);

  // Audio specific states
  const [audioDuration, setAudioDuration] = useState<number>(0);

  // Mic recording states
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset file selection when switching modes manually
  const handleTabChange = (tab: MediaType) => {
    setActiveTab(tab);
    setSelectedFile(null);
    setPreviewUrl(null);
    setBase64Data(null);
    setCapturedFrameBase64(null);
    setErrorMessage(null);
    setUrlInput('');
    setIsVideoPlaying(false);
    setVideoPlaybackError(null);
  };

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Detect media type from file or MIME
  const detectMediaType = (file: File): MediaType => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (type.startsWith('video/') || name.match(/\.(mp4|webm|mov|mkv|avi|m4v|3gp|ogv)$/i)) {
      return 'video';
    }
    if (type.startsWith('audio/') || name.match(/\.(mp3|wav|ogg|m4a|aac|flac|weba|opus|wma)$/i)) {
      return 'audio';
    }
    return 'image';
  };

  // Handle incoming file selection (with auto-tab routing!)
  const processFile = async (file: File) => {
    setErrorMessage(null);
    setVideoPlaybackError(null);

    const detectedType = detectMediaType(file);
    if (detectedType !== activeTab) {
      setActiveTab(detectedType);
    }

    try {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const base64 = await fileToBase64(file);
      setBase64Data(base64);

      if (detectedType === 'video') {
        setCapturedFrameBase64(null);
        setCurrentVideoTime(0);
        setIsVideoPlaying(false);
      }
    } catch (err) {
      console.error('Failed to load file:', err);
      setErrorMessage('Could not process the selected file. Please try another file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Capture current video frame to canvas
  const captureCurrentVideoFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frameDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedFrameBase64(frameDataUrl);
  };

  // Step video by delta seconds
  const stepVideo = (delta: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(videoDuration || 100, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = newTime;
    setCurrentVideoTime(newTime);
    // Auto capture frame on step
    setTimeout(captureCurrentVideoFrame, 150);
  };

  // Load Sample Benchmark
  const handleSelectSample = async (sample: typeof SAMPLE_MEDIA[0]) => {
    setErrorMessage(null);
    setVideoPlaybackError(null);
    setActiveTab(sample.mediaType);
    setClaimContext(sample.claimContext || '');
    setPreviewUrl(sample.mediaUrl);
    setSelectedFile(null);
    setIsVideoPlaying(false);

    try {
      if (sample.mediaUrl.startsWith('data:')) {
        // Direct Base64 data URI (e.g. synthesized audio WAV)
        setBase64Data(sample.mediaUrl);
      } else {
        // Fetch URL into base64
        const res = await fetch(sample.mediaUrl, { mode: 'cors' });
        const blob = await res.blob();
        const b64 = await fileToBase64(new File([blob], `${sample.id}.media`, { type: blob.type }));
        setBase64Data(b64);
        if (sample.mediaType === 'video') {
          // If direct image or video
          if (blob.type.startsWith('image/')) {
            setCapturedFrameBase64(b64);
          }
        }
      }
    } catch (e) {
      console.warn('Sample load fallback:', e);
      setBase64Data(sample.mediaUrl);
    }
  };

  // URL ingestion submit
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setErrorMessage(null);

    try {
      setPreviewUrl(urlInput);
      const res = await fetch(urlInput, { mode: 'cors' });
      const blob = await res.blob();
      const b64 = await fileToBase64(new File([blob], 'url-media', { type: blob.type }));
      setBase64Data(b64);
    } catch (e) {
      setBase64Data(urlInput);
    }
  };

  // Live Microphone Voice Recording
  const startMicRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'live-voice-recording.wav', { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setPreviewUrl(audioUrl);
        setSelectedFile(audioFile);
        const b64 = await fileToBase64(audioFile);
        setBase64Data(b64);

        // Stop tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingMic(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setErrorMessage('Microphone access was denied or is unavailable on this device.');
    }
  };

  const stopMicRecording = () => {
    if (mediaRecorderRef.current && isRecordingMic) {
      mediaRecorderRef.current.stop();
      setIsRecordingMic(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Final Submit to Scan API
  const handleScanSubmit = () => {
    if (activeTab === 'video') {
      const payloadBase64 = capturedFrameBase64 || base64Data;
      if (!payloadBase64) {
        setErrorMessage('Please capture a specific video keyframe for forensic inspection.');
        return;
      }
      onAnalyze({
        mediaBase64: payloadBase64,
        mimeType: 'image/jpeg',
        claimContext: claimContext.trim() || undefined,
        mediaType: 'video',
        fileName: selectedFile?.name || 'video-keyframe-extract.jpg',
        videoTimestamp: Number(currentVideoTime.toFixed(2)),
      });
    } else if (activeTab === 'audio') {
      if (!base64Data) {
        setErrorMessage('Please select, upload, or record an audio file for speech analysis.');
        return;
      }
      onAnalyze({
        mediaBase64: base64Data,
        mimeType: selectedFile?.type || 'audio/wav',
        claimContext: claimContext.trim() || undefined,
        mediaType: 'audio',
        fileName: selectedFile?.name || 'audio-voice-sample.wav',
        audioDuration: audioDuration || 4.5,
      });
    } else {
      if (!base64Data) {
        setErrorMessage('Please upload an image to analyze.');
        return;
      }
      onAnalyze({
        mediaBase64: base64Data,
        mimeType: selectedFile?.type || 'image/jpeg',
        claimContext: claimContext.trim() || undefined,
        mediaType: 'image',
        fileName: selectedFile?.name || 'visual-scan.jpg',
      });
    }
  };

  const isReadyToScan = Boolean(
    (activeTab === 'video' && (capturedFrameBase64 || base64Data || previewUrl)) ||
    (activeTab === 'audio' && (base64Data || previewUrl)) ||
    (activeTab === 'image' && (base64Data || previewUrl))
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Tab Mode Selector */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-lg">
          <button
            id="tab-image-btn"
            type="button"
            onClick={() => handleTabChange('image')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'image'
                ? 'bg-[#00D9FF] text-[#0A192F] shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-[#112240]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image Scan</span>
          </button>

          <button
            id="tab-video-btn"
            type="button"
            onClick={() => handleTabChange('video')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'video'
                ? 'bg-[#00D9FF] text-[#0A192F] shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-[#112240]'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Keyframe Scan</span>
          </button>

          <button
            id="tab-audio-btn"
            type="button"
            onClick={() => handleTabChange('audio')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'audio'
                ? 'bg-[#00D9FF] text-[#0A192F] shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                : 'text-slate-300 hover:text-white hover:bg-[#112240]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice / Audio Scan</span>
          </button>
        </div>
      </div>

      {/* Main Upload Card Container */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0A192F] border border-[#1E3A5F] shadow-xl space-y-6">
        {/* Supported Formats Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#070D18] border border-[#1E3A5F]/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-[#11263F] border border-[#1E3A5F]">
              {activeTab === 'video' ? 'Video Formats' : activeTab === 'audio' ? 'Audio Formats' : 'Image Formats'}
            </span>
            <span className="font-mono text-slate-300">
              {activeTab === 'video'
                ? 'MP4, WebM, MOV, MKV, AVI, M4V'
                : activeTab === 'audio'
                ? 'MP3, WAV, M4A, AAC, OGG, FLAC, WEBA'
                : 'JPEG, PNG, WEBP, GIF, BMP'}
            </span>
          </div>
          <span className="text-[10px] text-[#00D9FF] font-semibold">
            Auto-Detects Dropped Media
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#FF3B5C]/15 border border-[#FF3B5C]/40 text-[#FF3B5C] flex items-center gap-3 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Drag-and-Drop Zone (Shown when no media loaded) */}
        {!previewUrl ? (
          <div className="space-y-4">
            <div
              id="drop-zone"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all ${
                isDragging
                  ? 'border-[#00D9FF] bg-[#00D9FF]/10 shadow-[0_0_25px_rgba(0,217,255,0.2)]'
                  : 'border-[#1E3A5F] hover:border-[#00D9FF]/60 hover:bg-[#11263F]/50 bg-[#070D18]/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept={
                  activeTab === 'image'
                    ? 'image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp'
                    : activeTab === 'video'
                    ? 'video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v'
                    : 'audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.weba'
                }
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-[#11263F] border border-[#1E3A5F] flex items-center justify-center text-[#00D9FF] mb-4 shadow-inner">
                {activeTab === 'image' ? (
                  <ImageIcon className="w-7 h-7 animate-pulse" />
                ) : activeTab === 'video' ? (
                  <FileVideo className="w-7 h-7 animate-pulse" />
                ) : (
                  <FileAudio className="w-7 h-7 animate-pulse" />
                )}
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {activeTab === 'image'
                    ? 'Drop any image here, or browse'
                    : activeTab === 'video'
                    ? 'Drop any video file here, or browse'
                    : 'Drop any voice/audio file here, or browse'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {activeTab === 'image'
                    ? 'Upload photographs, portraits, screenshots, or generated artwork for forensic noise & artifact inspection.'
                    : activeTab === 'video'
                    ? 'Upload video footage to inspect frame-by-frame, scrub timestamps, and analyze face-swaps & deepfake boundaries.'
                    : 'Upload speech recordings or voice notes to analyze spectral phase, vocoder signatures, and biological breath acoustics.'}
                </p>
              </div>
            </div>

            {/* Live Mic Recording Quick Action (in Voice tab) */}
            {activeTab === 'audio' && (
              <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E3A5F] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF]">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Record Live Voice from Microphone</h4>
                    <p className="text-[11px] text-slate-400">Speak into your mic to test voice authenticity in real time</p>
                  </div>
                </div>

                {!isRecordingMic ? (
                  <button
                    type="button"
                    onClick={startMicRecording}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#FF3B5C] hover:bg-[#FF3B5C]/90 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,59,92,0.3)]"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopMicRecording}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#FFB800] hover:bg-[#FFB800]/90 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all animate-pulse"
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Stop ({recordingSeconds}s)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Active Media Preview / Player */
          <div className="space-y-4">
            {/* Image Preview */}
            {activeTab === 'image' && (
              <div className="relative rounded-2xl overflow-hidden bg-black max-h-96 flex items-center justify-center border border-[#1E3A5F]">
                <img
                  src={previewUrl}
                  alt="Inspection Target"
                  className="max-h-96 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setBase64Data(null);
                    setSelectedFile(null);
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-bold backdrop-blur border border-white/20 transition-all"
                >
                  Change Image
                </button>
              </div>
            )}

            {/* Video Player with Interactive Keyframe Scrubber */}
            {activeTab === 'video' && (
              <div className="space-y-4 p-4 rounded-2xl bg-[#070D18] border border-[#1E3A5F]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#00D9FF]" />
                    <span>Interactive Video Frame Inspector</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setBase64Data(null);
                      setCapturedFrameBase64(null);
                      setSelectedFile(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Change Video
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black max-h-80 flex items-center justify-center border border-[#1E3A5F]">
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    controls
                    playsInline
                    preload="auto"
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        const dur = videoRef.current.duration;
                        setVideoDuration(dur);
                        captureCurrentVideoFrame();
                      }
                    }}
                    onTimeUpdate={() => {
                      if (videoRef.current) {
                        setCurrentVideoTime(videoRef.current.currentTime);
                      }
                    }}
                    onSeeked={() => {
                      captureCurrentVideoFrame();
                    }}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => {
                      setIsVideoPlaying(false);
                      captureCurrentVideoFrame();
                    }}
                    onError={(e) => {
                      console.warn('Video load notice:', e);
                      setVideoPlaybackError('Direct video playback error. Keyframe analysis fallback active.');
                    }}
                    className="max-h-80 w-auto object-contain rounded-lg"
                  />
                </div>

                {videoPlaybackError && (
                  <div className="text-[11px] text-[#FFB800] bg-[#FFB800]/10 p-2 rounded-lg border border-[#FFB800]/20">
                    {videoPlaybackError}
                  </div>
                )}

                {/* Precision Frame Scrubber & Stepper Controls */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="font-bold text-[#00D9FF]">
                      Timestamp: {currentVideoTime.toFixed(2)}s
                    </span>
                    <span>Total: {videoDuration > 0 ? `${videoDuration.toFixed(2)}s` : 'Stream'}</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={videoDuration || 60}
                    step="0.05"
                    value={currentVideoTime}
                    onChange={(e) => {
                      const time = parseFloat(e.target.value);
                      if (videoRef.current) {
                        videoRef.current.currentTime = time;
                        setCurrentVideoTime(time);
                        setTimeout(captureCurrentVideoFrame, 100);
                      }
                    }}
                    className="w-full h-2 bg-[#1E3A5F] rounded-lg appearance-none cursor-pointer accent-[#00D9FF]"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {/* Stepping controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => stepVideo(-1)}
                        className="px-2 py-1.5 rounded-lg bg-[#11263F] hover:bg-[#1E3A5F] text-slate-200 text-xs font-mono"
                        title="Step backward 1.0s"
                      >
                        -1s
                      </button>

                      <button
                        type="button"
                        onClick={() => stepVideo(-0.2)}
                        className="px-2 py-1.5 rounded-lg bg-[#11263F] hover:bg-[#1E3A5F] text-slate-200 text-xs font-mono flex items-center gap-1"
                        title="Step backward 0.2s"
                      >
                        <StepBack className="w-3 h-3" /> -0.2s
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (videoRef.current) {
                            if (isVideoPlaying) {
                              videoRef.current.pause();
                            } else {
                              videoRef.current.play();
                            }
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#11263F] hover:bg-[#1E3A5F] text-white text-xs font-bold"
                      >
                        {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => stepVideo(0.2)}
                        className="px-2 py-1.5 rounded-lg bg-[#11263F] hover:bg-[#1E3A5F] text-slate-200 text-xs font-mono flex items-center gap-1"
                        title="Step forward 0.2s"
                      >
                        +0.2s <StepForward className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => stepVideo(1)}
                        className="px-2 py-1.5 rounded-lg bg-[#11263F] hover:bg-[#1E3A5F] text-slate-200 text-xs font-mono"
                        title="Step forward 1.0s"
                      >
                        +1s
                      </button>
                    </div>

                    {/* Manual Frame Capture Button */}
                    <button
                      type="button"
                      onClick={captureCurrentVideoFrame}
                      className="px-3.5 py-1.5 rounded-xl bg-[#00D9FF]/20 hover:bg-[#00D9FF]/30 text-[#00D9FF] border border-[#00D9FF]/40 text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,217,255,0.2)]"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Lock Current Frame</span>
                    </button>
                  </div>

                  {/* Captured Frame Confirmation Banner */}
                  {capturedFrameBase64 && (
                    <div className="p-3 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-between gap-3 text-xs text-[#00D9FF]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span className="font-bold">
                          Keyframe extracted at {currentVideoTime.toFixed(2)}s for AI forensic analysis
                        </span>
                      </div>
                      <img
                        src={capturedFrameBase64}
                        alt="Locked Keyframe"
                        className="w-14 h-9 object-cover rounded-lg border border-[#00D9FF]/40 shadow"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Audio Waveform & Speech Preview */}
            {activeTab === 'audio' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#00D9FF]" />
                    <span>Acoustic Waveform Inspection Player</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setBase64Data(null);
                      setSelectedFile(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Change Audio
                  </button>
                </div>

                <AudioWaveformPlayer
                  audioSrc={previewUrl}
                  fileName={selectedFile?.name || 'Voice Audio Stream'}
                  onDurationLoaded={(d) => setAudioDuration(d)}
                />
              </div>
            )}
          </div>
        )}

        {/* URL Input Form */}
        {!previewUrl && (
          <form onSubmit={handleUrlSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste media URL (e.g. image, video MP4, or audio WAV/MP3 link)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070D18] border border-[#1E3A5F] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
              />
            </div>
            <button
              type="submit"
              disabled={!urlInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#11263F] hover:bg-[#1E3A5F] disabled:opacity-50 text-slate-200 text-xs font-bold border border-[#1E3A5F] transition-all"
            >
              Load URL
            </button>
          </form>
        )}

        {/* Optional Claim / Context Text Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <span>Add context (caption, claim, or background info)</span>
            <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={claimContext}
            onChange={(e) => setClaimContext(e.target.value)}
            placeholder="e.g. 'Viral video claiming to show a CEO admitting to corporate fraud in a leaked recording...'"
            className="w-full p-3 rounded-xl bg-[#070D18] border border-[#1E3A5F] text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00D9FF] transition-all"
          />
        </div>

        {/* Main "Scan Now" Button */}
        <button
          id="scan-now-btn"
          type="button"
          onClick={handleScanSubmit}
          disabled={!isReadyToScan || isLoading}
          className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-sm sm:text-base tracking-wide transition-all shadow-lg ${
            isReadyToScan && !isLoading
              ? 'bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A192F] shadow-[0_0_30px_rgba(0,217,255,0.35)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
              : 'bg-[#11263F] text-slate-500 border border-[#1E3A5F] cursor-not-allowed opacity-60'
          }`}
        >
          <FileSearch className="w-5 h-5" />
          <span>{isLoading ? 'Executing Forensic Inspection…' : 'Scan Now'}</span>
        </button>
      </div>

      {/* 1-Click Forensic Test Benchmarks */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
            Test Benchmarks (1-Click Instant Load)
          </span>
          <span className="text-[11px] text-slate-500">Image • Video • Audio</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SAMPLE_MEDIA.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="p-3.5 rounded-2xl bg-[#0A192F] hover:bg-[#11263F] border border-[#1E3A5F] hover:border-[#00D9FF]/40 text-left transition-all group flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[#11263F] text-[#00D9FF] border border-[#1E3A5F]">
                    {sample.mediaType}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      sample.expectedVerdict === 'Likely Manipulated'
                        ? 'text-[#FF3B5C]'
                        : 'text-emerald-400'
                    }`}
                  >
                    {sample.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors truncate">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end text-[10px] font-bold text-[#00D9FF] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Load Sample →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
