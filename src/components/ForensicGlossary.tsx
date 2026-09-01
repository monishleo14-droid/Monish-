import React, { useState } from 'react';
import {
  BookOpen,
  Eye,
  Layers,
  Activity,
  Mic,
  Video,
  Heart,
  Search,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const ForensicGlossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ela');

  const topics = [
    {
      id: 'ela',
      title: 'Error Level Analysis (ELA)',
      category: 'Image Forensics',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      summary: 'Reveals re-compression variance across different regions of a JPEG image.',
      mechanism:
        'When an image is saved as a JPEG, lossy DCT quantization occurs. If a region (like a face) was edited, pasted, or rendered separately and resaved, it will have a different error dissipation rate than the unmodified background. Under ELA amplification (10x-20x), edited areas shine noticeably brighter or darker.',
      howToSpot: [
        'Unnaturally bright white/purple halos around faces or objects.',
        'Sharp contrast borders between high-error faces and low-error background canvas.',
        'Discontinuous quantization patterns along the mandibular jawline.',
      ],
      diagram: 'JPEG Matrix → Quality Recompression (75%) → Absolute Pixel Delta × 15x Gain → Error Heatmap',
    },
    {
      id: 'pupil_specular',
      title: 'Bilateral Corneal Specular Reflection',
      category: 'Ocular Forensics',
      icon: <Eye className="w-5 h-5 text-emerald-400" />,
      summary: 'Light source reflection angles and shapes in human pupils.',
      mechanism:
        'In genuine photography, the cornea acts as a convex mirror reflecting the ambient environment. Both human eyes must reflect the exact same light sources with mathematically consistent angular azimuths. AI models (Midjourney, DALL-E, Stable Diffusion) generate each eye independently or from latent noise, resulting in conflicting highlight shapes (e.g. square window in one eye, round softbox in the other) or angle divergence exceeding 20°.',
      howToSpot: [
        'Catchlights have different geometric shapes between left and right eyes.',
        'Direction of the primary highlight indicates conflicting light sources.',
        'Pupil boundary is elliptical or non-circular without biological cause.',
      ],
      diagram: 'Light Vector A (Left Eye Azimuth: 32°) ≠ Light Vector B (Right Eye Azimuth: 70°) → AI Synthesis Confirmed',
    },
    {
      id: 'noise_sensor',
      title: 'Sensor ISO Noise Floor & High-Pass Filtering',
      category: 'Physical Optics',
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      summary: 'Consistency of Poisson/Gaussian camera sensor noise across color channels.',
      mechanism:
        'Real physical camera sensors introduce consistent ISO noise across all pixels according to Bayer color filter arrays. Generative AI models generate imagery in latent diffusion space where high frequencies are smoothed out, leaving plastic skin with zero micro-sensor grain while backgrounds retain arbitrary texture.',
      howToSpot: [
        'Poreless "airbrushed" or plastic skin texture in non-focal regions.',
        'Abrupt noise floor transition where face meets hair or clothing.',
        'Loss of micro-vascular subcutaneous skin details.',
      ],
      diagram: 'Laplacian 3x3 Filter → High-Frequency Isolation → Noise Variance Ratio Analysis',
    },
    {
      id: 'neural_vocoder',
      title: 'Neural Vocoder Phase & Frequency Cutoff',
      category: 'Audio Forensics',
      icon: <Mic className="w-5 h-5 text-purple-400" />,
      summary: 'Acoustic signatures of Text-to-Speech (TTS) and voice cloning systems.',
      mechanism:
        'Modern voice clones (ElevenLabs, Tortoise, VALL-E) pass mel-spectrograms through neural vocoders (HiFi-GAN, WaveGlow). To maintain fast inference speeds, these models operate at 22kHz/24kHz sample rates, creating an unnatural steep 96dB/octave brickwall frequency cutoff at 11kHz or 12kHz. Furthermore, human speech naturally contains pulmonary respiration pauses, saliva clicks, and glottal closures that AI voice engines omit.',
      howToSpot: [
        'Sharp spectral energy cliff above 11.2 kHz on FFT spectrograms.',
        'Metallic sibilant ringing or phase smearing on consonants (/s/, /sh/, /f/).',
        'Continuous unbroken speech delivered without lung volume intake.',
      ],
      diagram: 'Mel-Spectrogram → HiFi-GAN Vocoder → Steep 11kHz Bandwidth Cutoff + Phase Smear',
    },
    {
      id: 'temporal_jitter',
      title: 'Inter-Frame Boundary Shimmering & Blink Dynamics',
      category: 'Video Forensics',
      icon: <Video className="w-5 h-5 text-indigo-400" />,
      summary: 'Temporal instability in video deepfakes and face swaps.',
      mechanism:
        'Frame-by-frame deepfake generators (DeepFaceLab, RoOP, FaceFusion) process video frames independently or with short temporal windows. When the subject rotates their head (pitch/yaw/roll), the facial landmark alignment jumps slightly, creating a shimmering border along the jaw and hairline. Eye blinks often show texture dissolving rather than muscle contraction.',
      howToSpot: [
        'Flickering or ghosting halos along the jawline during head movements.',
        'Abnormal eye blink frequencies (< 2 per minute or > 30 per minute).',
        'Earlobe and glasses frame warping as the head turns.',
      ],
      diagram: 'Frame N → Warp Mask Matrix → Alignment Drift on Frame N+1 → Boundary Shimmer',
    },
    {
      id: 'rppg_pulse',
      title: 'Remote Photoplethysmography (rPPG)',
      category: 'Biometrics',
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      summary: 'Micro-vascular blood pulse color variation in living human tissue.',
      mechanism:
        'With each human heartbeat, oxygenated blood surges into facial capillaries, causing microscopic, periodic fluctuations in skin color (primarily in the green wavelength). rPPG algorithms extract this periodic signal (60-100 BPM) from forehead and cheek pixels. Synthetic deepfake filters and virtual webcam injections lack this biological cardiac rhythm.',
      howToSpot: [
        'Total absence of 0.8 Hz - 2.0 Hz cardiac periodic frequency peak in skin pixels.',
        'Zero facial skin color response to pulse waves.',
        'Static color values across video call frames.',
      ],
      diagram: 'Capillary Hemodynamics → Green Channel RGB Micro-Modulation → 72 BPM Pulse Waveform',
    },
  ];

  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTopic = topics.find((t) => t.id === selectedTopic) || topics[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Deepfake Forensics Knowledge Base & Artifact Guide</span>
              </h2>
              <p className="text-xs text-slate-400">
                Learn the scientific principles behind ELA, ocular specularity, rPPG biometrics, and neural vocoder forensics
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search forensic principles..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Topic List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          {filteredTopics.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      {topic.icon}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block">
                        {topic.category}
                      </span>
                      <h4 className="font-bold text-white text-sm">{topic.title}</h4>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{topic.summary}</p>
              </div>
            );
          })}
        </div>

        {/* Right Topic Detail (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                {activeTopic.icon}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {activeTopic.category} Forensics
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">{activeTopic.title}</h3>
                <p className="text-sm text-slate-300 mt-1">{activeTopic.summary}</p>
              </div>
            </div>

            {/* Scientific Mechanism */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Underlying Forensic Mechanism
              </h4>
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed">
                {activeTopic.mechanism}
              </div>
            </div>

            {/* Pipeline Diagram */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detection Pipeline Data Flow
              </h4>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-cyan-300 overflow-x-auto">
                {activeTopic.diagram}
              </div>
            </div>

            {/* How to Spot in the Field */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Forensic Investigator Checklist: What to Look For</span>
              </h4>
              <div className="space-y-2">
                {activeTopic.howToSpot.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold font-mono text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
