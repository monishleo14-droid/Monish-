import React from 'react';
import { ShieldCheck, ShieldAlert, Image, Video, Mic, Camera, FileText, BookOpen, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { MediaMode, SampleMediaItem } from '../types';
import { SAMPLE_MEDIA_ITEMS } from '../data/sampleData';

interface HeaderProps {
  currentMode: MediaMode;
  onSelectMode: (mode: MediaMode) => void;
  onSelectSample: (sample: SampleMediaItem) => void;
  onOpenReportModal?: () => void;
  hasActiveResult?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onSelectSample,
  onOpenReportModal,
  hasActiveResult,
}) => {
  const modes: { id: MediaMode; label: string; icon: React.ReactNode }[] = [
    { id: 'image', label: 'Image Forensics', icon: <Image className="w-4 h-4" /> },
    { id: 'video', label: 'Video Inspector', icon: <Video className="w-4 h-4" /> },
    { id: 'audio', label: 'Audio & Voice Clone', icon: <Mic className="w-4 h-4" /> },
    { id: 'camera', label: 'Live Camera Shield', icon: <Camera className="w-4 h-4" /> },
    { id: 'text', label: 'Text / AI Generator', icon: <FileText className="w-4 h-4" /> },
    { id: 'glossary', label: 'Forensic Guide', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">VeriFace</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Forensic v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Deepfake & Synthetic Media Detection Studio</p>
            </div>
          </div>

          {/* Quick Actions / Sample Selector / Export */}
          <div className="flex items-center gap-3">
            {/* Quick Sample Dropdown */}
            <div className="relative group">
              <button
                id="btn-sample-picker"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Samples</span>
              </button>
              <div className="absolute right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1 mb-1">
                  Load Forensic Case Samples
                </div>
                <div className="space-y-1">
                  {SAMPLE_MEDIA_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectSample(item)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center justify-between group/item transition"
                    >
                      <span className="truncate pr-2">{item.title}</span>
                      {item.type === 'deepfake' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">FAKE</span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">REAL</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Certificate Button */}
            {hasActiveResult && onOpenReportModal && (
              <button
                id="btn-export-report"
                onClick={onOpenReportModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Audit Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-1 border-t border-slate-800/60">
          {modes.map((tab) => {
            const isActive = currentMode === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-mode-${tab.id}`}
                onClick={() => onSelectMode(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
