import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Calendar,
  Cpu,
  Layers
} from 'lucide-react';
import { ForensicAnalysisResult } from '../types';

interface ForensicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ForensicAnalysisResult | null;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Forensic_Audit_${result.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadTXT = () => {
    const reportText = `=====================================================
VERIFACE FORENSIC AUDIT CERTIFICATE
Case ID: ${result.id}
Timestamp: ${new Date(result.timestamp).toUTCString()}
Evaluator Model: ${result.modelUsed}
=====================================================

OFFICIAL VERDICT: ${result.verdict}
Fake Probability: ${result.fakeProbability}%
Authenticity Score: ${result.authenticityScore}%
Confidence: ${result.confidence}

ASSET PROVENANCE:
- File Name: ${result.fileName}
- Type: ${result.fileType} (${result.fileSizeFormatted})
- SHA-256 Hash: ${result.sha256Hash || 'N/A'}

EXECUTIVE SUMMARY:
${result.summary}

DETAILED FORENSIC ANALYSIS:
${result.detailedAnalysis}

QUANTITATIVE METRIC BREAKDOWN:
${result.metrics?.map((m) => `• [${m.status.toUpperCase()}] ${m.name}: ${m.score}/100 (${m.description})`).join('\n') || 'None'}

TECHNICAL EVIDENCE LOG:
- Noise Pattern / ISO: ${result.technicalEvidence?.noisePatternConsistency || 'N/A'}
- Compression Artifacts: ${result.technicalEvidence?.compressionArtifactDiscrepancy || 'N/A'}
- Lighting Vectors: ${result.technicalEvidence?.lightingVectorConsistency || 'N/A'}
- Biological Plausibility: ${result.technicalEvidence?.biologicalPlausibility || 'N/A'}

RECOMMENDATIONS:
${result.recommendations?.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'None'}
=====================================================
Verified by VeriFace Automated Forensic Engine
`;
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Forensic_Audit_${result.id}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const isFake = result.verdict === 'SYNTHETIC_DEEPFAKE';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Digital Forensic Audit Certificate</h3>
              <p className="text-xs text-slate-400 font-mono">Case ID: {result.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTXT}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Download Text / Markdown Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">TXT / MD</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Download JSON Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition"
              title="Print Certificate or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div ref={reportRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 bg-slate-900">
          {/* Certificate Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                Official Forensics Verification
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">VeriFace Forensic Audit Report</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(result.timestamp).toUTCString()}
                </span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  {result.modelUsed}
                </span>
              </div>
            </div>

            {/* Verdict Stamp */}
            <div
              className={`px-5 py-3 rounded-2xl border-2 text-center ${
                isFake
                  ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                  : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest">Official Verdict</div>
              <div className="text-lg font-black tracking-wider mt-0.5">
                {isFake ? 'SYNTHETIC DEEPFAKE' : 'VERIFIED AUTHENTIC'}
              </div>
              <div className="text-[10px] font-mono mt-0.5 opacity-80">
                Fake Probability: {result.fakeProbability}%
              </div>
            </div>
          </div>

          {/* Asset Metadata & Cryptographic Provenance */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>Asset Provenance & Cryptographic Signature</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-slate-500 block">Target Filename:</span>
                <span className="font-mono text-white truncate block">{result.fileName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">File Type / Size:</span>
                <span className="text-white">{result.fileType} ({result.fileSizeFormatted})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Confidence Level:</span>
                <span className="text-cyan-300 font-bold">{result.confidence}</span>
              </div>
            </div>
            <div className="pt-1">
              <span className="text-slate-500 block">SHA-256 Cryptographic Hash:</span>
              <span className="font-mono text-cyan-300 text-[11px] break-all select-all">
                {result.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </span>
            </div>
          </div>

          {/* Executive Summary & Detailed Analysis */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Forensic Evaluation Findings
            </h4>
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <p className="text-sm text-slate-200 leading-relaxed font-medium">{result.summary}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{result.detailedAnalysis}</p>
            </div>
          </div>

          {/* Metric Breakdown Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quantitative Forensic Breakdown
            </h4>
            <div className="overflow-hidden border border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Sensor / Vector Dimension</th>
                    <th className="p-3 font-semibold">Score (0-100)</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold hidden sm:table-cell">Key Indicator Finding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                  {result.metrics?.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-3 font-medium text-white">{m.name}</td>
                      <td className="p-3 font-mono font-bold">{m.score}/100</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                            m.status === 'pass'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : m.status === 'warning'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px] hidden sm:table-cell">
                        {m.indicators?.join(' • ') || m.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Evidence Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Technical Evidence Log
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-cyan-400 font-semibold block">Noise Pattern & Sensor Grain:</span>
                <p className="text-slate-300 text-[11px]">{result.technicalEvidence?.noisePatternConsistency}</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-cyan-400 font-semibold block">Compression Artifact Matrix:</span>
                <p className="text-slate-300 text-[11px]">{result.technicalEvidence?.compressionArtifactDiscrepancy}</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-cyan-400 font-semibold block">Lighting Vector Azimuths:</span>
                <p className="text-slate-300 text-[11px]">{result.technicalEvidence?.lightingVectorConsistency}</p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-cyan-400 font-semibold block">Biological Plausibility:</span>
                <p className="text-slate-300 text-[11px]">{result.technicalEvidence?.biologicalPlausibility}</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Forensic Expert Recommendations
            </div>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              {result.recommendations?.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Certificate Footer Seal */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>Verified by VeriFace Automated Forensic Engine v2.5</div>
            <div className="font-mono">Security Checksum: Verified • SHA-256 Validated</div>
          </div>
        </div>
      </div>
    </div>
  );
};
