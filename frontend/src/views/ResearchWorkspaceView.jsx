import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useResearchStore from '../store/useResearchStore';
import { generateResearch, exportToPDF } from '../services/api';
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Clock,
  ShieldCheck,
  Quote,
  BarChart2,
  ExternalLink,
  Activity,
  Flame,
  Copy,
  Check,
  Zap,
  Camera,
  Globe,
  Link2,
} from 'lucide-react';

// Extract clean domain label (e.g., espncricinfo.com, bbc.com)
const getDomain = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return 'source';
  }
};

// Image Card Component with graceful fallback handling
function ImageCard({ image, index }) {
  const [hasError, setHasError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(image.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900/90 flex flex-col transition-all hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {!hasError ? (
          <img
            src={image.url}
            alt={image.title || 'Archival match photograph'}
            loading="lazy"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="p-4 text-center flex flex-col items-center justify-center text-slate-500 space-y-1">
            <ImageIcon className="w-6 h-6 text-slate-600" />
            <p className="text-[11px] font-medium text-slate-400">Archival Still Reference</p>
          </div>
        )}

        {/* Hover overlay with quick actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-white bg-black/70 hover:bg-emerald-500 hover:text-black px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 transition-colors"
          >
            <span>View Full</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={handleCopy}
            className="text-[11px] text-white bg-black/70 hover:bg-white/20 p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer"
            title="Copy image direct link"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
          {image.title || `Match Photo #${index + 1}`}
        </p>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>STILL #{index + 1}</span>
          <span className="text-emerald-400/90 font-semibold">VERIFIED ARCHIVE</span>
        </div>
      </div>
    </div>
  );
}

// Preset famous cricket turning points with authentic match imagery
const PRESETS = [
  {
    label: 'Headingley 2019: Stokes 135*',
    topic: 'Ben Stokes 135* & Jack Leach Headingley Ashes 2019',
    points: `Jack Leach cleaning his glasses between balls\n76-run last-wicket miraculous partnership\nNathan Lyon missed run-out chance and Australian DRS review\nAtmosphere at Leeds as Stokes reverse-swept Nathan Lyon`,
    length: 500,
    image: '/images/cricket/stokes-headingley.jpg',
  },
  {
    label: 'MCG 2022: Kohli 82* vs Pak',
    topic: 'Virat Kohli 82* vs Pakistan MCG 2022 T20 World Cup',
    points: `Two consecutive sixes against Haris Rauf in the 19th over\nMohammad Nawaz final over psychological pressure & no-ball\nKohli pre-tournament form and media criticism\n90,000 MCG stadium crowd noise factor`,
    length: 550,
    image: '/images/cricket/kohli-roar.jpg',
  },
  {
    label: 'Motera 2011: Yuvraj WC QF',
    topic: 'Yuvraj Singh 57* vs Australia 2011 World Cup Quarter Final Motera',
    points: `Ending Australia 12-year unbeaten World Cup streak\nYuvraj emotional celebration on knees screaming with joy\nPartnership with Suresh Raina in tense 261 chase\nBrett Lee bowling fast spells under extreme heat`,
    length: 500,
    image: '/images/cricket/yuvraj-six.jpg',
  },
  {
    label: 'Sharjah 1998: Sachin Desert Storm',
    topic: 'Sachin Tendulkar 143 vs Australia Sharjah Desert Storm 1998',
    points: `Sandstorm interruption altering target and qualification run-rate\nSachin brutal assault on Shane Warne around the wicket\nTony Greig iconic television commentary enthusiasm\nQualifying India for the Coca-Cola Cup final single-handedly`,
    length: 500,
    image: '/images/cricket/sachin-legend.jpg',
  },
  {
    label: 'Edgbaston 2019: Smith Twin Tons',
    topic: 'Steve Smith 144 & 142 Edgbaston Ashes 2019 Redemption',
    points: `Hostile English crowd sand-paper jeers and boos\nRescuing Australia from 122/8 in first innings\nUnorthodox batting leaves and leaving outside off-stump\nExhausting Stuart Broad and James Anderson in swinging conditions`,
    length: 500,
    image: '/images/cricket/smith-aura.jpg',
  },
];

export default function ResearchWorkspaceView({ onBack }) {
  const { dossier, setDossier, isLoading, setLoading, error, setError, reset } =
    useResearchStore();

  const [topic, setTopic] = useState(dossier?.topic || '');
  const [preContextText, setPreContextText] = useState('');
  const [researchLength, setResearchLength] = useState(500);
  const [includeMedia, setIncludeMedia] = useState(false);

  const handleNewTopic = () => {
    reset();
    setTopic('');
    setPreContextText('');
  };

  // UX Feedback States
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live Agent Progress Ticker
  useEffect(() => {
    let timer = null;
    let stepTimer = null;

    if (isLoading) {
      setElapsedSeconds(0);
      setLoadingStep(0);

      timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);

      // Transition through agent steps
      stepTimer = setTimeout(() => setLoadingStep(1), 2500);
      const stepTimer2 = setTimeout(() => setLoadingStep(2), 7000);
      const stepTimer3 = setTimeout(() => setLoadingStep(3), 13000);

      return () => {
        clearInterval(timer);
        clearTimeout(stepTimer);
        clearTimeout(stepTimer2);
        clearTimeout(stepTimer3);
      };
    }
  }, [isLoading]);

  const loadPreset = (preset) => {
    setTopic(preset.topic);
    setPreContextText(preset.points);
    setResearchLength(preset.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const preContext = preContextText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .slice(0, 5);

    // ── Clear stale state immediately ────────────────────────────────────
    // Without this, the OLD dossier stays visible while the agent is running.
    // We wipe it here so the empty-state / loading panel shows right away.
    setDossier(null);
    setError(null);
    setLoading(true);

    try {
      const { data } = await generateResearch({
        topic: topic.trim(),
        preContext,
        researchLength,
        includeMedia,
      });

      setDossier(data.data.dossier);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Research compilation failed. Check backend console and API keys.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!dossier) return;
    try {
      const response = await exportToPDF(dossier);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CricScript-${dossier.topic
        ?.substring(0, 30)
        .replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('PDF generation failed. Please try again.');
    }
  };

  const handleCopyMarkdown = () => {
    if (!dossier) return;
    const report = dossier.synthesizedReport || {};
    
    let md = `# ${dossier.topic}\n\n`;
    md += `*Generated: ${new Date(dossier.generatedAt).toLocaleString()}*\n\n`;
    if (report.executiveSummary) md += `## Executive Summary\n${report.executiveSummary}\n\n`;
    if (report.keyChronology?.length) {
      md += `## Key Chronology\n`;
      report.keyChronology.forEach(c => {
        md += `- **${c.timestampOrDate}**: ${c.eventDescription} *(Why it mattered: ${c.significance})*\n`;
      });
      md += '\n';
    }
    if (report.verifiedQuotes?.length) {
      md += `## Verified Quotes\n`;
      report.verifiedQuotes.forEach(q => {
        md += `> "${q.quote}"\n> — **${q.speaker}** (${q.context})\n\n`;
      });
    }
    if (dossier.collectedImages?.length) {
      md += `## Curated Visual Archives\n`;
      dossier.collectedImages.forEach((img, i) => {
        md += `${i + 1}. [${img.title || 'Archival Match Photograph'}](${img.url})\n`;
      });
      md += '\n';
    }
    if (report.sources?.length) {
      md += `## Verified Sources & Articles\n`;
      report.sources.forEach((src, i) => {
        md += `${i + 1}. [${src.title}](${src.url})\n`;
      });
    }

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const report = dossier?.synthesizedReport;

  const agentSteps = [
    { title: 'Formulating Search Vectors', desc: 'Planning scorecard, pitch, and quotes queries' },
    { title: 'Scanning Cricket Archives', desc: 'Executing multi-hop search across Cricinfo & HowStat' },
    { title: 'Analyzing Tactics & Quotes', desc: 'Filtering verified post-match press statements' },
    { title: 'Grounding Facts via Gemini', desc: 'Synthesizing structured dossier with zero hallucination' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-[#030712]/90 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>HUB</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-sm font-extrabold tracking-wide text-white uppercase flex items-center gap-2">
              <span className="text-emerald-400">ENGINE 01</span> / DEEP RESEARCH WORKSPACE
            </span>
          </div>

          <div className="flex items-center gap-3">
            {dossier && (
              <button
                onClick={handleNewTopic}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                title="Start a new research query"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Topic</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Agents Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Workspace Body ── */}
      <main className="max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-[410px_1fr] gap-8 flex-1 items-start">
        
        {/* ── LEFT COLUMN: INPUT BRIEF CONSOLE ── */}
        <aside className="lg:sticky lg:top-20 space-y-5">
          
          {/* Quick Preset Inspiration Bar */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant Match Inspiration
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => loadPreset(p)}
                  className={`relative overflow-hidden text-left p-2.5 rounded-xl bg-[#090d16] hover:bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-[11px] font-medium text-slate-200 hover:text-white transition-all cursor-pointer group shadow-md ${
                    i === PRESETS.length - 1 ? 'col-span-2' : ''
                  }`}
                  title={p.topic}
                >
                  {/* Subtle Background Match Slice with Matte Mask */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.label}
                      className="w-full h-full object-cover object-[50%_15%] opacity-30 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 contrast-125 saturate-90"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to right, rgba(9,13,22,0.92) 20%, rgba(9,13,22,0.65) 100%)',
                      }}
                    />
                  </div>
                  <div className="relative z-10 flex items-center gap-1.5 truncate">
                    <span className="text-amber-400 font-bold shrink-0">⚡</span>
                    <span className="truncate font-semibold text-white/90 group-hover:text-white">
                      {p.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="cricket-card rounded-2xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h2 className="text-sm font-extrabold tracking-wider uppercase text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Directorial Brief
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">Ground-Truth Fact</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Topic Input */}
              <div>
                <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                  Cricket Topic / Match / Over
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 2019 World Cup Final Stokes Overthrow"
                  className="w-full bg-slate-900/90 text-white border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none placeholder-slate-500 transition-colors"
                  required
                />
              </div>

              {/* Pre-Context Angles */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                    Key Angles to Investigate
                  </label>
                  <span className="text-[11px] text-slate-500">1 per line, max 5</span>
                </div>
                <textarea
                  value={preContextText}
                  onChange={(e) => setPreContextText(e.target.value)}
                  rows={4}
                  placeholder={`Pitch deterioration and reverse swing\nPlayer pre-tournament form\nControversial umpire decisions\nPress conference quotes`}
                  className="w-full bg-slate-900/90 text-white border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none placeholder-slate-500 resize-none transition-colors"
                />
              </div>

              {/* Research Word Limit Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Max Word Limit
                  </span>
                  <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {researchLength} words
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={researchLength}
                  onChange={(e) => setResearchLength(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>100 (Tight)</span>
                  <span>500 (Standard)</span>
                  <span>1000 (Exhaustive)</span>
                </div>
              </div>

              {/* Include Media Toggle */}
              <div className={`flex items-center justify-between border rounded-xl px-3.5 py-2.5 transition-colors ${
                includeMedia
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    includeMedia ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-200">Include Photos & Links</p>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                        includeMedia ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {includeMedia ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {includeMedia
                        ? 'Extracts match stills, photo archives & source links'
                        : 'Saves tokens with pure text dossier'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeMedia(!includeMedia)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    includeMedia ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                  aria-label="Toggle include photos and links"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      includeMedia ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Run Agent Button (Solid Authoritative Cricket Turf Emerald) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-[#10b981] hover:bg-[#059669] disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-black font-extrabold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Agent Digging Archives ({elapsedSeconds}s)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>RUN RESEARCH AGENT 🏏</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </aside>


        {/* ── RIGHT COLUMN: DOSSIER CANVAS ── */}
        <section className="space-y-6">
          
          {/* ── LIVE AGENT PROGRESS RADAR (DURING LOADING) ── */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="relative rounded-2xl p-8 border border-emerald-500/40 space-y-6 bg-[#090d16] overflow-hidden shadow-2xl"
              >
                {/* Background Stadium Image Feathered via Radial Mask */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <img
                    src="/images/cricket/stadium-mcg.jpg"
                    alt="Radar Backdrop"
                    className="w-full h-full object-cover object-center opacity-15 contrast-125"
                    style={{
                      maskImage:
                        'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 20%, transparent 75%)',
                      WebkitMaskImage:
                        'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 20%, transparent 75%)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-[#090d16]/70" />
                </div>

                {/* Ambient top structural line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/40" />

                <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-emerald-400 animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold uppercase tracking-wide text-white">
                        Autonomous Multi-Hop Investigation
                      </h3>
                      <p className="text-xs text-slate-400">
                        Synthesizing scorecards, pitch reports, and press conferences
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {elapsedSeconds}s Elapsed
                  </span>
                </div>

                {/* Step Pipeline */}
                <div className="relative z-10 space-y-3">
                  {agentSteps.map((step, idx) => {
                    const isDone = loadingStep > idx;
                    const isCurrent = loadingStep === idx;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: isCurrent ? 1 : isDone ? 0.9 : 0.4 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                            : isDone
                            ? 'bg-slate-900/60 border-white/10 text-slate-300'
                            : 'bg-transparent border-transparent text-slate-500'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isDone
                              ? 'bg-[#10b981] text-black'
                              : isCurrent
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400 animate-pulse'
                              : 'bg-slate-800 text-slate-600'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold leading-none">{step.title}</p>
                          <p className="text-[11px] opacity-70 mt-1 truncate">{step.desc}</p>
                        </div>
                        {isCurrent && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-6 text-rose-300 text-xs shadow-xl">
              <p className="font-bold uppercase tracking-wider text-sm mb-1">Execution Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Empty State: Curated Legendary Case Studies Launchpad */}
          {!dossier && !isLoading && !error && (
            <div className="relative rounded-2xl p-6 md:p-8 border border-white/10 bg-[#090d16] overflow-hidden shadow-2xl space-y-6">
              {/* Subtle atmospheric stadium background with radial feathering */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img
                  src="/images/cricket/stadium-mcg.jpg"
                  alt="Stadium Atmosphere"
                  className="w-full h-full object-cover object-center opacity-15 contrast-125 saturate-75"
                  style={{
                    maskImage:
                      'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 15%, transparent 70%)',
                    WebkitMaskImage:
                      'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 15%, transparent 70%)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-[#090d16]/80" />
              </div>

              {/* Canvas Header */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Autonomous Research Canvas Ready
                  </div>
                  <h3 className="text-2xl md:text-3xl font-cricket-title tracking-wide text-white uppercase">
                    FEATURED ARCHIVES FOR INVESTIGATION
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Click any legendary match card below to populate the brief, or type your own topic on the left.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    Multi-Hop Vector Search
                  </span>
                </div>
              </div>

              {/* 3 Prominent Match Cards: Sachin, Stokes, Yuvraj */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Card 1: Sachin Tendulkar No. 10 */}
                <div
                  onClick={() => loadPreset(PRESETS[3])}
                  className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/50 bg-[#030712] p-5 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 shadow-xl"
                >
                  <img
                    src="/images/cricket/sachin-legend.jpg"
                    alt="Sachin Tendulkar Desert Storm"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-45 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 contrast-125 saturate-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                      Sharjah 1998
                    </span>
                    <span className="text-xs text-white/60 group-hover:text-emerald-400 transition-colors">
                      ⚡ 1-Click
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-2xl font-cricket-title tracking-wide text-white uppercase group-hover:text-emerald-300 transition-colors">
                      Sachin 143 Desert Storm
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-snug">
                      Assault on Shane Warne altered run-rate qualification against Australia.
                    </p>
                    <button
                      type="button"
                      className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-[#10b981] hover:text-black border border-white/15 text-white text-[11px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Load Investigation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card 2: Ben Stokes 135* Headingley */}
                <div
                  onClick={() => loadPreset(PRESETS[0])}
                  className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/50 bg-[#030712] p-5 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 shadow-xl"
                >
                  <img
                    src="/images/cricket/stokes-headingley.jpg"
                    alt="Ben Stokes Headingley Miracle"
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-45 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 contrast-125 saturate-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                      Headingley 2019
                    </span>
                    <span className="text-xs text-white/60 group-hover:text-emerald-400 transition-colors">
                      ⚡ 1-Click
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-2xl font-cricket-title tracking-wide text-white uppercase group-hover:text-emerald-300 transition-colors">
                      Stokes 135* Ashes Miracle
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-snug">
                      76-run last-wicket miraculous stand with Jack Leach cleaning glasses.
                    </p>
                    <button
                      type="button"
                      className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-[#10b981] hover:text-black border border-white/15 text-white text-[11px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Load Investigation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card 3: Yuvraj Singh 2011 QF Roar */}
                <div
                  onClick={() => loadPreset(PRESETS[2])}
                  className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/50 bg-[#030712] p-5 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 shadow-xl"
                >
                  <img
                    src="/images/cricket/yuvraj-six.jpg"
                    alt="Yuvraj Singh World Cup Quarter Final Roar"
                    className="absolute inset-0 w-full h-full object-cover object-[50%_35%] opacity-45 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 contrast-125 saturate-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                      Motera 2011 QF
                    </span>
                    <span className="text-xs text-white/60 group-hover:text-emerald-400 transition-colors">
                      ⚡ 1-Click
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-2xl font-cricket-title tracking-wide text-white uppercase group-hover:text-emerald-300 transition-colors">
                      Yuvraj 57* Australia QF
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-snug">
                      Ending Australia 12-year unbeaten World Cup streak in a tense 261 chase.
                    </p>
                    <button
                      type="button"
                      className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-[#10b981] hover:text-black border border-white/15 text-white text-[11px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Load Investigation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Helpful footer hint */}
              <div className="relative z-10 flex items-center justify-between pt-3 text-xs text-slate-400 font-mono">
                <span>Or enter any custom cricketer, test match, or series brief on the left.</span>
                <span className="text-emerald-400">Strict Fact Grounding 🛡️</span>
              </div>
            </div>
          )}

          {/* ── Active Dossier Display ── */}
          {dossier && !isLoading && (
            <motion.div
              key={dossier.generatedAt}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              
              {/* Dossier Header Banner with Horizontal Stadium Crop */}
              <div className="relative rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#090d16] overflow-hidden shadow-2xl">
                {/* Horizontal atmospheric crop with directional matte mask */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <img
                    src="/images/cricket/stadium-mcg.jpg"
                    alt="Stadium Match Lighting"
                    className="w-full h-full object-cover object-[50%_25%] opacity-25 contrast-125 saturate-75"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to right, #090d16 40%, rgba(9,13,22,0.8) 70%, rgba(9,13,22,0.3) 100%)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Verified Research Dossier
                  </div>
                  <h2 className="text-2xl md:text-3xl font-cricket-title tracking-wide text-white uppercase">
                    {dossier.topic}
                  </h2>
                  <p className="text-slate-400 text-xs mt-1.5 flex flex-wrap items-center gap-3 font-mono">
                    <span>{new Date(dossier.generatedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>~{dossier.estimatedWordCount || 500} words</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">Strictly Grounded</span>
                    {dossier.collectedImages?.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <Camera className="w-3 h-3" /> {dossier.collectedImages.length} Photos Included
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                  <button
                    onClick={handleCopyMarkdown}
                    className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Copy formatted markdown to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-black font-extrabold text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Download className="w-4 h-4 text-black" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* 1. Executive Summary */}
              {report?.executiveSummary && (
                <div className="cricket-card rounded-2xl p-6 border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> 1. Executive Summary
                  </h3>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {report.executiveSummary}
                  </p>
                </div>
              )}

              {/* 2. Pre-Match Context */}
              {report?.preMatchContext?.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-white/10 space-y-4">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <Flame className="w-4 h-4" /> 2. Pre-Match Context & Historical Stakes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.preMatchContext.map((item, idx) => (
                      <div key={idx} className="bg-slate-900/80 rounded-xl p-4 border border-white/5">
                        <p className="text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                          ▸ {item.angle}
                        </p>
                        <p className="text-slate-300 text-xs leading-relaxed">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Chronology Timeline */}
              {report?.keyChronology?.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-white/10 space-y-5">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4" /> 3. Key Chronology & Turning Points
                  </h3>
                  <div className="relative pl-6 space-y-5">
                    {/* Vertical Green Line */}
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-500/30 to-transparent" />

                    {report.keyChronology.map((item, idx) => (
                      <div key={idx} className="relative group">
                        {/* Dot */}
                        <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-slate-950 group-hover:scale-125 transition-transform" />
                        <span className="text-amber-400 font-mono text-xs font-bold uppercase">
                          {item.timestampOrDate}
                        </span>
                        <p className="text-white text-sm font-semibold mt-0.5 group-hover:text-emerald-300 transition-colors">
                          {item.eventDescription}
                        </p>
                        <p className="text-slate-400 text-xs mt-1 italic leading-relaxed">
                          ↳ Why it mattered: {item.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Tactical Breakdown */}
              {report?.tacticalBreakdown?.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-white/10 space-y-4">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    4. Tactical & Analytical Breakdown
                  </h3>
                  <div className="space-y-3">
                    {report.tacticalBreakdown.map((item, idx) => (
                      <div key={idx} className="bg-slate-900/70 rounded-xl p-4 border border-white/5 space-y-1.5">
                        <h4 className="text-white text-sm font-bold">{item.subheading}</h4>
                        <p className="text-slate-300 text-xs leading-relaxed">{item.analysis}</p>
                        {item.supportingData && (
                          <div className="pt-2">
                            <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono px-2 py-0.5 rounded">
                              📊 {item.supportingData}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Verified Quotes */}
              {report?.verifiedQuotes?.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-white/10 space-y-4">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <Quote className="w-4 h-4" /> 5. Verified Quotes & Post-Match Statements
                  </h3>
                  <div className="space-y-3">
                    {report.verifiedQuotes.map((q, idx) => (
                      <blockquote key={idx} className="border-l-3 border-amber-500 pl-4 py-1 bg-slate-900/40 rounded-r-xl">
                        <p className="text-slate-100 text-sm italic">"{q.quote}"</p>
                        <footer className="mt-2 text-xs">
                          <span className="text-amber-400 font-bold">— {q.speaker}</span>
                          <span className="text-slate-500 text-[11px] ml-2">({q.context})</span>
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Statistical Highlights */}
              {report?.statHighlights?.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-white/10 space-y-4">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" /> 6. Statistical Anomalies
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 pr-4 font-bold">Metric</th>
                          <th className="py-2.5 pr-4 font-bold text-emerald-400">Value</th>
                          <th className="py-2.5 font-bold">Historical Context</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {report.statHighlights.map((s, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="py-3 pr-4 text-slate-200 font-medium">{s.metric}</td>
                            <td className="py-3 pr-4 font-mono font-bold text-emerald-400 text-sm">
                              {s.value}
                            </td>
                            <td className="py-3 text-slate-400">{s.historicalContext}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 7. Curated Visual Archives & Match Photography (When Media Enabled) */}
              {dossier.collectedImages && dossier.collectedImages.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-emerald-500/20 space-y-4 bg-gradient-to-b from-slate-900/90 to-slate-950">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        7. Archival Photography & Visual Moments
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {dossier.collectedImages.length} High-Res Stills
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    High-impact archival stills pulled directly from verified match coverage and official broadcast reports.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                    {dossier.collectedImages.map((img, idx) => (
                      <ImageCard key={idx} image={img} index={idx} />
                    ))}
                  </div>
                </div>
              )}

              {/* 8. Verified Sources & News Articles */}
              {report?.sources?.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                        {dossier.collectedImages?.length > 0 ? '8. Verified Sources & Articles' : '7. Verified Sources & Articles'}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {report.sources.length} Ground-Truth Links
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.sources.map((src, idx) => {
                      const domain = getDomain(src.url);
                      return (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-900/70 hover:bg-slate-900 p-3.5 rounded-xl border border-white/5 hover:border-emerald-500/30 flex items-start justify-between gap-3 transition-all group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {domain}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-200 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                              {src.title}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono truncate mt-1">
                              {src.url}
                            </p>
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-300" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </section>

      </main>

    </div>
  );
}
