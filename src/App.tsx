/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageForensics } from './components/ImageForensics';
import { VideoInspector } from './components/VideoInspector';
import { AudioForensics } from './components/AudioForensics';
import { LiveCameraShield } from './components/LiveCameraShield';
import { TextAnalyzer } from './components/TextAnalyzer';
import { ForensicGlossary } from './components/ForensicGlossary';
import { ForensicReportModal } from './components/ForensicReportModal';
import { MediaMode, SampleMediaItem, ForensicAnalysisResult } from './types';
import { SAMPLE_MEDIA_ITEMS } from './data/sampleData';

export default function App() {
  const [currentMode, setCurrentMode] = useState<MediaMode>('image');
  const [activeResult, setActiveResult] = useState<ForensicAnalysisResult | null>(
    SAMPLE_MEDIA_ITEMS[0].preloadedResult
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const handleSelectSample = (sample: SampleMediaItem) => {
    if (sample.category === 'image') {
      setCurrentMode('image');
      setActiveResult(sample.preloadedResult);
    } else if (sample.category === 'video') {
      setCurrentMode('video');
    } else if (sample.category === 'audio') {
      setCurrentMode('audio');
    }
  };

  const handleScanComplete = (result: ForensicAnalysisResult) => {
    setActiveResult(result);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        onSelectSample={handleSelectSample}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        hasActiveResult={Boolean(activeResult)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentMode === 'image' && (
          <ImageForensics
            onScanComplete={handleScanComplete}
            activeResult={activeResult}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}

        {currentMode === 'video' && <VideoInspector />}

        {currentMode === 'audio' && <AudioForensics />}

        {currentMode === 'camera' && (
          <LiveCameraShield
            onScanComplete={handleScanComplete}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}

        {currentMode === 'text' && <TextAnalyzer />}

        {currentMode === 'glossary' && <ForensicGlossary />}
      </main>

      {/* Audit Report Modal */}
      <ForensicReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        result={activeResult}
      />

      {/* Minimalist Footer */}
      <footer className="py-4 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VeriFace Multi-Spectrum Deepfake & Synthetic Media Forensics Suite</span>
          <span className="font-mono text-[11px] text-slate-600">
            Powered by Gemini 3.7 Flash Multimodal AI • Error Level Analysis (ELA) • C2PA Provenance
          </span>
        </div>
      </footer>
    </div>
  );
}
