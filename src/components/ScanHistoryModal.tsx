import React from 'react';
import {
  X,
  Trash2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  ChevronRight,
  Mic,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { ScanHistoryItem, VerdictType } from '../types';

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryItem[];
  onSelectScan: (item: ScanHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteScan: (id: string, e: React.MouseEvent) => void;
}

export const ScanHistoryModal: React.FC<ScanHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectScan,
  onClearHistory,
  onDeleteScan,
}) => {
  if (!isOpen) return null;

  const getVerdictBadge = (verdict: VerdictType) => {
    switch (verdict) {
      case 'Likely Authentic':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" /> Likely Authentic
          </span>
        );
      case 'Suspicious':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> Suspicious
          </span>
        );
      case 'Likely Manipulated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF3B5C]/15 text-[#FF3B5C] border border-[#FF3B5C]/40">
            <AlertOctagon className="w-3 h-3" /> Likely Manipulated
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="scan-history-modal"
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#0A192F] border border-[#1E3A5F] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1E3A5F] flex items-center justify-between bg-[#112240]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Forensic Scan History</h2>
              <p className="text-xs text-slate-400">
                {history.length} {history.length === 1 ? 'scan record' : 'scan records'} stored locally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                id="clear-all-history-btn"
                onClick={onClearHistory}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all"
                title="Clear all scan history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              id="close-history-modal-btn"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-[#0A192F] hover:bg-[#1E3A5F] border border-[#1E3A5F] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#112240] border border-[#1E3A5F] flex items-center justify-center text-slate-500 mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 mb-1">No Past Scans Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                No scans yet — try uploading media or analyzing voice audio to get started!
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A192F] font-bold text-xs shadow-[0_0_15px_rgba(0,217,255,0.3)] transition-all hover:scale-105"
              >
                Start First Analysis
              </button>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                onClick={() => {
                  onSelectScan(item);
                  onClose();
                }}
                className="group relative flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#112240]/80 hover:bg-[#162C52] border border-[#1E3A5F] hover:border-[#00D9FF]/50 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,217,255,0.1)]"
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  {/* Thumbnail / Media icon */}
                  <div className="relative w-14 h-14 rounded-lg bg-black/50 border border-[#1E3A5F] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.mediaType === 'audio' ? (
                      <div className="flex flex-col items-center justify-center text-[#00D9FF]">
                        <Mic className="w-6 h-6" />
                        <span className="text-[8px] font-mono uppercase mt-0.5">AUDIO</span>
                      </div>
                    ) : (
                      <img
                        src={item.mediaPreview}
                        alt="Scan thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  {/* Summary & Meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {getVerdictBadge(item.verdict)}
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {item.confidence}% Conf.
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0A192F] text-[#00D9FF] uppercase">
                        {item.mediaType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 truncate font-medium">
                      {item.summary || item.fileName || 'Forensic Scan Result'}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {item.fileName && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{item.fileName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => onDeleteScan(item.id, e)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#00D9FF] transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
