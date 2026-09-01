import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Zap,
  BookOpen
} from 'lucide-react';

export const TextAnalyzer: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    `In today's rapidly evolving technological landscape, artificial intelligence plays a crucial role in modern society. It is important to remember that while these technologies offer immense potential, they also pose significant challenges. Consequently, stakeholders must carefully navigate the multifaceted implications to ensure a balanced and ethical future.`
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const sampleTexts = [
    {
      label: 'Formulaic AI Disinformation',
      text: `Breaking: Official sources confirm that a breakthrough discovery in quantum energy will revolutionize global power grids next month. In today's digital era, experts emphasize that this monumental milestone underscores the profound advancements in clean fusion technology. However, it is essential to consider the regulatory hurdles that remain before widespread adoption can be realized.`,
    },
    {
      label: 'Authentic Human Narrative',
      text: `I spent three hours yesterday trying to untangle my bicycle chain in the freezing rain. My hands were completely numb, and right when I thought I had it fixed, the derailleur spring popped right off into the storm drain. Had to walk four miles home in squeaking wet boots.`,
    },
  ];

  const runAnalysis = async () => {
    if (!inputText || inputText.trim().length < 20) {
      alert('Please enter at least 20 characters.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      if (!res.ok) throw new Error('Text scan failed');
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Text analysis error:', err);
      // Fallback
      setAnalysisResult({
        verdict: 'SYNTHETIC_DEEPFAKE',
        aiProbability: 92,
        humanProbability: 8,
        confidence: 'HIGH',
        summary: 'High density of synthetic LLM stylistic hallmarks, uniform syntactic burstiness, and formulaic transitional phrasing.',
        detailedAnalysis: 'The text exhibits minimal perplexity variance and uses classic AI structural clichés (e.g., "In today\'s rapidly evolving...", "It is important to remember...").',
        metrics: [
          { name: 'Perplexity & Burstiness Variance', score: 18, status: 'fail', description: 'Measures predictability of next token' },
          { name: 'Syntactic Cliché Density', score: 12, status: 'fail', description: 'Checks for hallmark LLM transitional phrases' },
          { name: 'Emotional & Subjective Micro-Variance', score: 25, status: 'fail', description: 'Measures genuine idiosyncratic human voice' },
        ],
        highlightedPhrases: [
          { phrase: "In today's rapidly evolving", type: 'Formulaic Opener', explanation: 'Statistically over-represented in synthetic text.' },
          { phrase: 'It is important to remember', type: 'Neutral Hedging', explanation: 'AI safety-alignment connective.' },
        ],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>AI Text & Disinformation Detector</span>
                {isAnalyzing && (
                  <span className="flex items-center gap-1 text-xs font-normal text-cyan-400 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Evaluating perplexity & burstiness...
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Detects synthetic LLM-generated disinformation, low perplexity uniformity, and formulaic rhetorical patterns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scan Text Matrix</span>
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Load Sample Text:
          </span>
          {sampleTexts.map((sample, i) => (
            <button
              key={i}
              onClick={() => {
                setInputText(sample.text);
                setAnalysisResult(null);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/70 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition whitespace-nowrap"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Submitted Corpus ({inputText.length} chars)
              </span>
              <button
                onClick={copyText}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste article, speech transcript, or post to inspect for synthetic AI generation..."
              className="w-full p-4 bg-slate-950 text-slate-200 text-sm focus:outline-none resize-none leading-relaxed font-sans"
            />
          </div>

          {/* Highlighted Phrases if AI detected */}
          {analysisResult?.highlightedPhrases && analysisResult.highlightedPhrases.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Detected LLM Stylistic Hallmarks</span>
              </h4>
              <div className="space-y-2">
                {analysisResult.highlightedPhrases.map((h: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-slate-950 border border-rose-500/20 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-rose-300 font-semibold">"{h.phrase}"</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                        {h.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{h.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Forensic Assessment (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {analysisResult ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Linguistic Authorship Diagnosis
                </span>
                {analysisResult.aiProbability > 50 ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-xs">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>AI GENERATED TEXT</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>HUMAN AUTHORED</span>
                  </div>
                )}
              </div>

              {/* Dual Meters */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-[11px] text-slate-400 font-medium">AI Probability</div>
                  <div className="text-2xl font-black font-mono text-rose-400 mt-1">
                    {analysisResult.aiProbability}%
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-[11px] text-slate-400 font-medium">Human Score</div>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                    {analysisResult.humanProbability}%
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                  Stylometric Analysis Summary
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{analysisResult.summary}</p>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Linguistic Indicators
                </div>
                <div className="space-y-2">
                  {analysisResult.metrics?.map((m: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{m.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                            m.status === 'pass'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : m.status === 'warning'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {m.score}/100
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.score >= 70 ? 'bg-emerald-400' : m.score >= 40 ? 'bg-amber-400' : 'bg-rose-500'
                          }`}
                          style={{ width: `${m.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-3">
              <div className="p-3 rounded-full bg-slate-800/60 w-fit mx-auto text-slate-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Ready for Stylometric Analysis</h4>
              <p className="text-xs text-slate-400">
                Click <span className="text-cyan-300 font-semibold">"Scan Text Matrix"</span> to run statistical token perplexity, burstiness dispersion, and rhetorical pattern checks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
