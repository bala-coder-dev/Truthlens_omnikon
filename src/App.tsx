import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { MediaUploader } from './components/MediaUploader';
import { AnalyzingScanner } from './components/AnalyzingScanner';
import { ResultView } from './components/ResultView';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ScanHistoryModal } from './components/ScanHistoryModal';
import { LearnDeepfakesModal } from './components/LearnDeepfakesModal';
import { AnalysisResult, ScanHistoryItem, MediaType } from './types';
import { AlertTriangle, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'truthlens_scan_history_v2';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'upload' | 'analyzing' | 'result'>('landing');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [analyzingPayload, setAnalyzingPayload] = useState<{
    preview: string;
    mediaType: MediaType;
    claimContext?: string;
    videoTimestamp?: number;
  } | null>(null);

  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isLearnOpen, setIsLearnOpen] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to read scan history from localStorage:', e);
    }
  }, []);

  // Save history helper
  const saveHistoryToStorage = (newHistory: ScanHistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory.slice(0, 40)));
    } catch (e) {
      console.error('Failed to persist scan history:', e);
    }
  };

  // Trigger Forensic Analysis API (Multimodal: Image, Video Frame, Audio)
  const handleAnalyze = async (payload: {
    mediaBase64: string;
    mimeType: string;
    claimContext?: string;
    mediaType: MediaType;
    fileName?: string;
    videoTimestamp?: number;
    audioDuration?: number;
  }) => {
    setGlobalError(null);
    setAnalyzingPayload({
      preview: payload.mediaBase64,
      mediaType: payload.mediaType,
      claimContext: payload.claimContext,
      videoTimestamp: payload.videoTimestamp,
    });
    setCurrentPage('analyzing');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaBase64: payload.mediaBase64,
          mimeType: payload.mimeType,
          claimContext: payload.claimContext,
          mediaType: payload.mediaType,
          videoTimestamp: payload.videoTimestamp,
          audioDuration: payload.audioDuration,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || 'The forensic analysis engine encountered high load. Please retry.');
      }

      const resultData: AnalysisResult = {
        id: `scan-${Date.now()}`,
        timestamp: Date.now(),
        verdict: json.data.verdict,
        confidence: json.data.confidence,
        evidence: json.data.evidence,
        summary: json.data.summary,
        forensicBreakdown: json.data.forensicBreakdown,
        mediaPreview: payload.mediaBase64,
        mediaType: payload.mediaType,
        fileName: payload.fileName,
        claimContext: payload.claimContext,
        videoTimestamp: payload.videoTimestamp,
        audioDuration: payload.audioDuration,
      };

      setCurrentResult(resultData);

      // Auto-save to history
      const historyEntry: ScanHistoryItem = {
        id: resultData.id,
        timestamp: resultData.timestamp,
        verdict: resultData.verdict,
        confidence: resultData.confidence,
        summary: resultData.summary,
        mediaPreview: resultData.mediaPreview,
        mediaType: resultData.mediaType,
        fileName: resultData.fileName,
        evidence: resultData.evidence,
        videoTimestamp: resultData.videoTimestamp,
        audioDuration: resultData.audioDuration,
      };

      const updatedHistory = [historyEntry, ...history.filter((h) => h.id !== historyEntry.id)];
      saveHistoryToStorage(updatedHistory);

      setCurrentPage('result');
    } catch (err: any) {
      console.error('Forensic analysis failed:', err);
      // Friendly, non-intrusive fallback message
      setGlobalError(
        'Our forensic models are currently experiencing high traffic. A retry with our cascade fallback is ready.'
      );
      setCurrentPage('upload');
    }
  };

  // Manual save to history
  const handleSaveToHistory = (res: AnalysisResult) => {
    const historyEntry: ScanHistoryItem = {
      id: res.id,
      timestamp: res.timestamp,
      verdict: res.verdict,
      confidence: res.confidence,
      summary: res.summary,
      mediaPreview: res.mediaPreview,
      mediaType: res.mediaType,
      fileName: res.fileName,
      evidence: res.evidence,
      videoTimestamp: res.videoTimestamp,
      audioDuration: res.audioDuration,
    };
    const updatedHistory = [historyEntry, ...history.filter((h) => h.id !== res.id)];
    saveHistoryToStorage(updatedHistory);
  };

  // Select scan from history
  const handleSelectFromHistory = (item: ScanHistoryItem) => {
    setCurrentResult({
      id: item.id,
      timestamp: item.timestamp,
      verdict: item.verdict,
      confidence: item.confidence,
      evidence: item.evidence || [item.summary],
      summary: item.summary,
      mediaPreview: item.mediaPreview,
      mediaType: item.mediaType,
      fileName: item.fileName,
      videoTimestamp: item.videoTimestamp,
      audioDuration: item.audioDuration,
    });
    setCurrentPage('result');
  };

  const handleDeleteScan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((h) => h.id !== id);
    saveHistoryToStorage(updated);
  };

  const handleClearHistory = () => {
    saveHistoryToStorage([]);
  };

  const handleResetToLanding = () => {
    setGlobalError(null);
    setCurrentPage('landing');
  };

  const handleGoToUpload = () => {
    setGlobalError(null);
    setCurrentPage('upload');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070D18] text-slate-200 selection:bg-[#00D9FF]/30 selection:text-[#00D9FF]">
      {/* Navigation Header */}
      <Header
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenLearn={() => setIsLearnOpen(true)}
        onGoToUpload={handleGoToUpload}
        historyCount={history.length}
        onReset={handleResetToLanding}
        currentPage={currentPage}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Global Error Banner */}
        {globalError && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-4 rounded-xl bg-[#FF3B5C]/15 border border-[#FF3B5C]/40 text-[#FF3B5C] flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{globalError}</span>
              </div>
              <button
                onClick={() => setGlobalError(null)}
                className="px-3 py-1 rounded-lg bg-[#FF3B5C]/20 hover:bg-[#FF3B5C]/30 text-white text-xs font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Page 1: Landing / Hero Marketing View */}
        {currentPage === 'landing' && (
          <LandingHero
            onStartScanning={handleGoToUpload}
            onOpenLearn={() => setIsLearnOpen(true)}
          />
        )}

        {/* Page 2: Upload / Scanner View */}
        {currentPage === 'upload' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00D9FF] font-bold">
                FORENSIC MEDIA INGESTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Upload Target for AI Forensic Audit
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Inspect image pixels, scrub video keyframes, or analyze voice recordings for deepfake signatures.
              </p>
            </div>

            <MediaUploader onAnalyze={handleAnalyze} isLoading={false} />
          </div>
        )}

        {/* Page 3: Live Sweeping Laser Analyzing View */}
        {currentPage === 'analyzing' && analyzingPayload && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <AnalyzingScanner
              mediaPreview={analyzingPayload.preview}
              mediaType={analyzingPayload.mediaType}
              claimContext={analyzingPayload.claimContext}
              videoTimestamp={analyzingPayload.videoTimestamp}
            />
          </div>
        )}

        {/* Page 4: Forensic Results View */}
        {currentPage === 'result' && currentResult && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <ResultView
              result={currentResult}
              onReset={handleGoToUpload}
              onSaveToHistory={handleSaveToHistory}
              isSavedInHistory={history.some((h) => h.id === currentResult.id)}
              onOpenLearn={() => setIsLearnOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <ScanHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectScan={handleSelectFromHistory}
        onClearHistory={handleClearHistory}
        onDeleteScan={handleDeleteScan}
      />

      <LearnDeepfakesModal
        isOpen={isLearnOpen}
        onClose={() => setIsLearnOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-[#1E3A5F] bg-[#0A192F]/80 text-slate-400 py-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide">
                TRUTH<span className="text-[#00D9FF]">LENS</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">| VERIFY • ANALYZE • REVEAL</span>
            </div>
            <span>—</span>
            <span className="text-slate-400">Deepfake & Synthetic Media Forensic Inspector</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
            <button
              onClick={() => setIsLearnOpen(true)}
              className="hover:text-[#00D9FF] transition-colors"
            >
              Field Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="hover:text-[#00D9FF] transition-colors"
            >
              Pipeline
            </button>
            <span>•</span>
            <span>GEMINI MULTIMODAL FORENSICS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
