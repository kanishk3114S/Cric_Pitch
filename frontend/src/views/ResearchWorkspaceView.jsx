import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useResearchStore from '../store/useResearchStore';
import { generateResearch, exportToPDF } from '../services/api';
import { ThemeToggle } from '../context/ThemeContext';
import ErrorAlertPanel from '../components/ErrorAlertPanel';
import Button from '../components/ui/Button';
import {
  ArrowLeft,
  ArrowRight,
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
    <div className="group relative rounded-xl overflow-hidden border border-theme-subtle bg-theme-elevated flex flex-col transition-all hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="relative aspect-video w-full bg-theme-sunken flex items-center justify-center overflow-hidden">
        {!hasError ? (
          <img
            src={image.url}
            alt={image.title || 'Archival match photograph'}
            loading="lazy"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="p-4 text-center flex flex-col items-center justify-center text-theme-muted space-y-1">
            <ImageIcon className="w-6 h-6 text-theme-dim" />
            <p className="text-[11px] font-medium text-theme-muted">Archival Still Reference</p>
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
            title="Copy Image URL"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="p-2.5 flex flex-col justify-between flex-1 space-y-1.5">
        <p className="text-[11px] font-semibold text-theme-primary line-clamp-1 leading-snug">
          {image.title || 'Match Photograph'}
        </p>
        <div className="flex items-center justify-between text-[10px] text-theme-muted">
          <span className="font-mono bg-theme-app px-1.5 py-0.5 rounded border border-theme-subtle">
            {getDomain(image.sourceUrl || image.url)}
          </span>
          <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">Archival Still #{index + 1}</span>
        </div>
      </div>
    </div>
  );
}

// 4 Rich Historical Match Presets for Instant 1-Click Investigation
const PRESETS = [
  {
    label: "Headingley 2019: Stokes 135*",
    topic: "Ben Stokes 135* at Headingley Ashes 2019",
    angles: [
      "England 67 all-out first innings collapse trauma",
      "Jack Leach cleaning glasses during the 76-run last-wicket stand",
      "Nathan Lyon missed run-out and Joel Wilson LBW controversy",
      "Justin Langer kicking the water bottle in the Australian dressing room"
    ],
    image: "/images/cricket/stokes-headingley.jpg"
  },
  {
    label: "Gabba 2021: Pant's Siege",
    topic: "Rishabh Pant 89* at the Gabba 4th Test 2021",
    angles: [
      "Australia 32-year undefeated fortress record at Brisbane",
      "Indian injury crisis (net bowlers bowling: Siraj, Natarajan, Washington)",
      "Cheteshwar Pujara body blows against Cummins and Hazlewood short balls",
      "Pant final hour boundaries off Lyon and winning stroke down the ground"
    ],
    image: "/images/cricket/kohli-roar.jpg"
  },
  {
    label: "Motera 2011: Yuvraj Dethrones Aus",
    topic: "India vs Australia 2011 World Cup Quarter Final Ahmedabad",
    angles: [
      "Ponting fighting century under tournament scrutiny",
      "Yuvraj Singh kneeling roar off Brett Lee winning boundary",
      "Suresh Raina critical late-order partnership composure",
      "Ending Australia 12-year 3-tournament World Cup winning streak"
    ],
    image: "/images/cricket/yuvraj-six.jpg"
  },
  {
    label: "Sharjah 1998: Desert Storm",
    topic: "Sachin Tendulkar 143 vs Australia Sharjah Desert Storm 1998",
    angles: [
      "Sandstorm disruption and revised target calculations to qualify for final",
      "Assault against Shane Warne around the wicket into the midwicket stands",
      "Tony Greig immortal commentary calls: 'They are dancing in the aisles!'",
      "Single-handedly knocking New Zealand out on net run rate"
    ],
    image: "/images/cricket/sachin-legend.jpg"
  }
];

export default function ResearchWorkspaceView({ onBack, onNavigateLegal }) {
  const { dossier, isLoading, error, setDossier, setLoading, setError, reset } = useResearchStore();

  const [topic, setTopic] = useState('');
  const [preContextText, setPreContextText] = useState('');
  const [researchLength, setResearchLength] = useState(500);
  const [includeMedia, setIncludeMedia] = useState(true);

  // Live progress metrics
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Timer while agent is searching
  useEffect(() => {
    if (!isLoading) return;

    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    const step1 = setTimeout(() => setLoadingStep(1), 2500);
    const step2 = setTimeout(() => setLoadingStep(2), 6500);
    const step3 = setTimeout(() => setLoadingStep(3), 11000);

    return () => {
      clearInterval(timer);
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  }, [isLoading]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Prevent duplicate submissions while already running
    if (isLoading) return;
    if (!topic.trim()) return;

    setDossier(null);
    setLoading(true);
    setError(null);
    setElapsedSeconds(0);
    setLoadingStep(0);

    const preContext = preContextText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 5);

    try {
      const response = await generateResearch({
        topic: topic.trim(),
        preContext,
        researchLength,
        includeMedia,
      });

      if (response.data.success) {
        setDossier(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to compile research');
      }
    } catch (err) {
      console.error('Research Agent Error:', err);
      // Immediately pass structured backend error object
      setError({
        message: err.message || 'Research execution could not complete.',
        errorType: err.errorType || 'SERVER_ERROR',
        statusCode: err.statusCode || 500,
        retryable: err.retryable !== false,
        actionHint: err.actionHint || 'Please check your connection and try again.',
      });
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
      link.download = `${(dossier.topic || 'Cricket-Research').replace(/[^a-z0-9]/gi, '-').toLowerCase()}-dossier.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Download Error:', err);
      alert('Could not export PDF. Please try again in a moment.');
    }
  };

  const handleCopyMarkdown = () => {
    if (!dossier) return;
    const report = dossier.synthesizedReport;
    const text = `# ${dossier.topic} — Grounded Cricket Research Dossier
Compiled on ${new Date(dossier.generatedAt).toLocaleDateString()}

## 1. Executive Summary
${report?.executiveSummary || ''}

## 2. Pre-Match Context
${(report?.preMatchContext || []).map((c) => `- **${c.angle}**: ${c.detail}`).join('\n')}

## 3. Key Chronology & Turning Points
${(report?.keyChronology || []).map((k) => `- **${k.timestampOrDate}**: ${k.eventDescription} (Significance: ${k.significance})`).join('\n')}

## 4. Tactical Breakdown
${(report?.tacticalBreakdown || []).map((t) => `### ${t.subheading}\n${t.analysis}\n*Supporting Data: ${t.supportingData || 'N/A'}*`).join('\n\n')}

## 5. Verified Quotes
${(report?.verifiedQuotes || []).map((q) => `> "${q.quote}"\n> — **${q.speaker}** (${q.context})`).join('\n\n')}

## 6. Statistical Highlights
${(report?.statHighlights || []).map((s) => `- **${s.metric}**: ${s.value} (${s.historicalContext})`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (preset) => {
    setTopic(preset.topic);
    setPreContextText(preset.angles.join('\n'));
    setError(null);
  };

  const handleNewTopic = () => {
    reset();
    setTopic('');
    setPreContextText('');
  };

  const report = dossier?.synthesizedReport;

  const agentSteps = [
    { title: 'Structuring Research Angles', desc: 'Planning scorecard, pitch, and quotes queries' },
    { title: 'Scanning Cricket Archives', desc: 'Executing multi-hop search across Cricinfo & HowStat' },
    { title: 'Analyzing Tactics & Quotes', desc: 'Filtering verified post-match press statements' },
    { title: 'Grounding Facts via Gemini', desc: 'Synthesizing structured dossier with zero hallucination' },
  ];

  return (
    <div className="min-h-screen bg-theme-app text-theme-primary flex flex-col transition-colors">
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-theme-header backdrop-blur-md border-b border-theme-subtle px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowLeft}
              onClick={onBack}
              className="text-xs font-semibold uppercase tracking-wider"
            >
              HUB
            </Button>
            <div className="h-4 w-px bg-theme-medium" />
            <span className="text-sm font-extrabold tracking-wide text-theme-primary uppercase flex items-center gap-2">
              <span className="text-emerald-500">ENGINE 01</span> / DEEP RESEARCH WORKSPACE
            </span>
          </div>

          <div className="flex items-center gap-3">
            {dossier && (
              <Button
                variant="secondary"
                size="sm"
                icon={RotateCcw}
                onClick={handleNewTopic}
                className="text-xs"
                title="Start a new research query"
              >
                New Topic
              </Button>
            )}
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Agents Active</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main Workspace Body ── */}
      <main className="max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-[410px_1fr] gap-8 flex-1 items-start">
        
        {/* ── LEFT COLUMN: INPUT BRIEF CONSOLE ── */}
        <aside className="lg:sticky lg:top-20 space-y-5">
          
          {/* Quick Preset Inspiration Bar */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-theme-muted uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant Match Inspiration
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => loadPreset(p)}
                  className={`relative overflow-hidden text-left p-2.5 rounded-xl bg-theme-card hover:bg-theme-elevated border border-theme-subtle hover:border-emerald-500/40 text-[11px] font-medium text-theme-secondary hover:text-theme-primary transition-all cursor-pointer group shadow-theme-card ${
                    i === PRESETS.length - 1 ? 'col-span-2' : ''
                  }`}
                  title={p.topic}
                >
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.label}
                      className="w-full h-full object-cover object-[50%_15%] opacity-20 dark:opacity-35 group-hover:opacity-40 transition-all duration-500 contrast-115"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to right, var(--bg-card) 20%, transparent 100%)',
                      }}
                    />
                  </div>
                  <div className="relative z-10 flex items-center gap-1.5 truncate">
                    <span className="text-amber-500 font-bold shrink-0">⚡</span>
                    <span className="truncate font-semibold text-theme-primary">
                      {p.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="cricket-card rounded-2xl p-6 border border-theme-subtle space-y-5 bg-theme-card shadow-theme-card">
            <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
              <h2 className="text-sm font-extrabold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Directorial Brief
              </h2>
              <span className="text-[11px] text-theme-muted font-mono">Ground-Truth Fact</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Topic Input */}
              <div>
                <label className="block text-theme-secondary text-xs font-bold uppercase tracking-wider mb-1.5">
                  Cricket Topic / Match / Over
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 2019 World Cup Final Stokes Overthrow"
                  className="w-full bg-theme-input text-theme-primary border border-theme-subtle focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none placeholder-theme-dim transition-colors"
                  required
                />
              </div>

              {/* Pre-Context Angles */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-theme-secondary text-xs font-bold uppercase tracking-wider">
                    Key Angles to Investigate
                  </label>
                  <span className="text-[11px] text-theme-muted">1 per line, max 5</span>
                </div>
                <textarea
                  value={preContextText}
                  onChange={(e) => setPreContextText(e.target.value)}
                  rows={4}
                  placeholder={`Pitch deterioration and reverse swing\nPlayer pre-tournament form\nControversial umpire decisions\nPress conference quotes`}
                  className="w-full bg-theme-input text-theme-primary border border-theme-subtle focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none placeholder-theme-dim resize-none transition-colors"
                />
              </div>

              {/* Research Word Limit Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-theme-secondary font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-500" /> Max Word Limit
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
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
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-theme-elevated rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-theme-muted font-mono">
                  <span>100 (Tight)</span>
                  <span>500 (Standard)</span>
                  <span>1000 (Exhaustive)</span>
                </div>
              </div>

              {/* Include Media Toggle */}
              <div className={`flex items-center justify-between border rounded-xl px-3.5 py-2.5 transition-colors ${
                includeMedia
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-theme-elevated border-theme-subtle'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    includeMedia ? 'bg-emerald-500/20 text-emerald-500' : 'bg-theme-app text-theme-muted'
                  }`}>
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-theme-primary">Include Photos & Links</p>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                        includeMedia ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-theme-app text-theme-muted'
                      }`}>
                        {includeMedia ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[10px] text-theme-muted">
                      {includeMedia
                        ? 'Extracts match stills, photo archives & source links'
                        : 'Fast, lightweight text-only dossier'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeMedia(!includeMedia)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    includeMedia ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-700'
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

              {/* Run Agent Button */}
              <Button
                type="submit"
                variant="emerald"
                size="xl"
                disabled={isLoading}
                isLoading={isLoading}
                icon={!isLoading ? Sparkles : undefined}
                className="w-full uppercase font-extrabold text-xs tracking-wider shadow-lg shadow-emerald-600/20"
              >
                {isLoading ? `Investigating Match Archives (${elapsedSeconds}s)...` : 'RUN RESEARCH INVESTIGATION 🏏'}
              </Button>

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
                className="relative rounded-2xl p-8 border border-emerald-500/40 space-y-6 bg-theme-card overflow-hidden shadow-theme-card"
              >
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <picture className="w-full h-full">
                    <source srcSet="/images/cricket/stadium-mcg-4k.webp" type="image/webp" />
                    <img
                      src="/images/cricket/stadium-mcg-4k.jpg"
                      alt="4K Stadium Radar Backdrop"
                      className="w-full h-full object-cover object-center opacity-10 dark:opacity-15 contrast-125"
                    />
                  </picture>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 30%, var(--bg-card) 85%)',
                    }}
                  />
                </div>

                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/40" />

                <div className="relative z-10 flex items-center justify-between pb-4 border-b border-theme-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-emerald-500 animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold uppercase tracking-wide text-theme-primary">
                        Autonomous Multi-Hop Investigation
                      </h3>
                      <p className="text-xs text-theme-muted">
                        Synthesizing scorecards, pitch reports, and press conferences
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
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
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
                            : isDone
                            ? 'bg-theme-elevated border-theme-subtle text-theme-secondary'
                            : 'bg-transparent border-transparent text-theme-muted'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 text-black'
                              : isCurrent
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500 animate-pulse'
                              : 'bg-theme-elevated text-theme-muted'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold leading-none">{step.title}</p>
                          <p className="text-[11px] opacity-70 mt-1 truncate">{step.desc}</p>
                        </div>
                        {isCurrent && (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contextual & Actionable Error State */}
          {error && !isLoading && (
            <ErrorAlertPanel
              error={error}
              onRetry={handleSubmit}
              onDismiss={() => setError(null)}
            />
          )}

          {/* Empty State: Curated Legendary Case Studies Launchpad */}
          {!dossier && !isLoading && !error && (
            <div className="relative rounded-2xl p-6 md:p-8 border border-theme-subtle bg-theme-card overflow-hidden shadow-theme-card space-y-6">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <picture className="w-full h-full">
                  <source srcSet="/images/cricket/stadium-mcg-4k.webp" type="image/webp" />
                  <img
                    src="/images/cricket/stadium-mcg-4k.jpg"
                    alt="4K Stadium Atmosphere"
                    className="w-full h-full object-cover object-center opacity-10 dark:opacity-15 contrast-125 saturate-75"
                  />
                </picture>
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 20%, var(--bg-card) 85%)',
                  }}
                />
              </div>

              {/* Canvas Header */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-theme-subtle">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Autonomous Research Canvas Ready
                  </div>
                  <h3 className="text-2xl md:text-3xl font-cricket-title tracking-wide text-theme-primary uppercase">
                    FEATURED ARCHIVES FOR INVESTIGATION
                  </h3>
                  <p className="text-theme-muted text-xs mt-1">
                    Click any legendary match card below to populate the brief, or type your own topic on the left.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-theme-muted bg-theme-elevated border border-theme-subtle px-3 py-1.5 rounded-lg">
                    Autonomous Cross-Source Verification
                  </span>
                </div>
              </div>

              {/* 3 Prominent Match Cards: Sachin, Stokes, Yuvraj */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Card 1: Sachin Tendulkar No. 10 */}
                <div
                  onClick={() => loadPreset(PRESETS[3])}
                  className="group relative h-80 rounded-2xl overflow-hidden border border-theme-subtle hover:border-emerald-500/50 bg-theme-card p-5 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 shadow-theme-card"
                >
                  <img
                    src="/images/cricket/sachin-legend.jpg"
                    alt="Sachin Tendulkar Desert Storm"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-45 dark:opacity-45 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500 contrast-125 saturate-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                      Sharjah 1998
                    </span>
                    <span className="text-xs text-white/70 group-hover:text-emerald-400 transition-colors">
                      ⚡ 1-Click
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-2xl font-cricket-title tracking-wide text-white uppercase group-hover:text-emerald-300 transition-colors">
                      Sachin 143 Desert Storm
                    </h4>
                    <p className="text-[11px] text-slate-200 line-clamp-2 mt-1 leading-snug">
                      Assault on Shane Warne altered run-rate qualification against Australia.
                    </p>
                    <button
                      type="button"
                      className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Load Investigation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card 2: Ben Stokes 135* Headingley */}
                <div
                  onClick={() => loadPreset(PRESETS[0])}
                  className="group relative h-80 rounded-2xl overflow-hidden border border-theme-subtle hover:border-emerald-500/50 bg-theme-card p-5 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 shadow-theme-card"
                >
                  <img
                    src="/images/cricket/stokes-headingley.jpg"
                    alt="Ben Stokes Headingley Miracle"
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-45 dark:opacity-45 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500 contrast-125 saturate-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                      Headingley 2019
                    </span>
                    <span className="text-xs text-white/70 group-hover:text-emerald-400 transition-colors">
                      ⚡ 1-Click
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-2xl font-cricket-title tracking-wide text-white uppercase group-hover:text-emerald-300 transition-colors">
                      Stokes 135* Ashes Miracle
                    </h4>
                    <p className="text-[11px] text-slate-200 line-clamp-2 mt-1 leading-snug">
                      76-run last-wicket miraculous stand with Jack Leach cleaning glasses.
                    </p>
                    <button
                      type="button"
                      className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Load Investigation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card 3: Yuvraj Singh 2011 QF Roar */}
                <div
                  onClick={() => loadPreset(PRESETS[2])}
                  className="group relative h-80 rounded-2xl overflow-hidden border border-theme-subtle hover:border-emerald-500/50 bg-theme-card p-5 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 shadow-theme-card"
                >
                  <img
                    src="/images/cricket/yuvraj-six.jpg"
                    alt="Yuvraj Singh World Cup Quarter Final Roar"
                    className="absolute inset-0 w-full h-full object-cover object-[50%_35%] opacity-45 dark:opacity-45 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500 contrast-125 saturate-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                      Motera 2011 QF
                    </span>
                    <span className="text-xs text-white/70 group-hover:text-emerald-400 transition-colors">
                      ⚡ 1-Click
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-2xl font-cricket-title tracking-wide text-white uppercase group-hover:text-emerald-300 transition-colors">
                      Yuvraj 57* Australia QF
                    </h4>
                    <p className="text-[11px] text-slate-200 line-clamp-2 mt-1 leading-snug">
                      Ending Australia 12-year unbeaten World Cup streak in a tense 261 chase.
                    </p>
                    <button
                      type="button"
                      className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Load Investigation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Helpful footer hint */}
              <div className="relative z-10 flex items-center justify-between pt-3 text-xs text-theme-muted font-mono">
                <span>Or enter any custom cricketer, test match, or series brief on the left.</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Strict Fact Grounding 🛡️</span>
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
              <div className="relative rounded-2xl p-6 md:p-8 border border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-theme-card overflow-hidden shadow-theme-card">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <picture className="w-full h-full">
                    <source srcSet="/images/cricket/stadium-mcg-4k.webp" type="image/webp" />
                    <img
                      src="/images/cricket/stadium-mcg-4k.jpg"
                      alt="4K Stadium Match Lighting"
                      className="w-full h-full object-cover object-[50%_25%] opacity-15 dark:opacity-25 contrast-125 saturate-75"
                    />
                  </picture>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to right, var(--bg-card) 40%, transparent 100%)',
                    }}
                  />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Verified Research Dossier
                  </div>
                  <h2 className="text-2xl md:text-3xl font-cricket-title tracking-wide text-theme-primary uppercase">
                    {dossier.topic}
                  </h2>
                  <p className="text-theme-muted text-xs mt-1.5 flex flex-wrap items-center gap-3 font-mono">
                    <span>{new Date(dossier.generatedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>~{dossier.estimatedWordCount || 500} words</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Strictly Grounded</span>
                    {dossier.collectedImages?.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-amber-500 font-semibold flex items-center gap-1">
                          <Camera className="w-3 h-3" /> {dossier.collectedImages.length} Photos Included
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                  <Button
                    variant="secondary"
                    size="md"
                    icon={copied ? Check : Copy}
                    onClick={handleCopyMarkdown}
                    className="text-xs font-semibold"
                    title="Copy formatted markdown to clipboard"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>

                  <Button
                    variant="emerald"
                    size="md"
                    icon={Download}
                    onClick={handleDownloadPDF}
                    className="uppercase font-extrabold text-xs tracking-wider shadow-lg shadow-emerald-500/20"
                  >
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* 1. Executive Summary */}
              {report?.executiveSummary && (
                <div className="cricket-card rounded-2xl p-6 border border-theme-subtle space-y-3 bg-theme-card">
                  <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> 1. Executive Summary
                  </h3>
                  <p className="text-theme-secondary text-sm leading-relaxed">
                    {report.executiveSummary}
                  </p>
                </div>
              )}

              {/* 2. Pre-Match Context */}
              {report?.preMatchContext?.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-theme-subtle space-y-4 bg-theme-card">
                  <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <Flame className="w-4 h-4" /> 2. Pre-Match Context & Historical Stakes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.preMatchContext.map((item, idx) => (
                      <div key={idx} className="bg-theme-elevated rounded-xl p-4 border border-theme-subtle">
                        <p className="text-amber-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                          ▸ {item.angle}
                        </p>
                        <p className="text-theme-secondary text-xs leading-relaxed">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Chronology Timeline */}
              {report?.keyChronology?.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-theme-subtle space-y-5 bg-theme-card">
                  <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4" /> 3. Key Chronology & Turning Points
                  </h3>
                  <div className="relative pl-6 space-y-5">
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-500/30 to-transparent" />

                    {report.keyChronology.map((item, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-theme-app group-hover:scale-125 transition-transform" />
                        <span className="text-amber-500 font-mono text-xs font-bold uppercase">
                          {item.timestampOrDate}
                        </span>
                        <p className="text-theme-primary text-sm font-semibold mt-0.5 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                          {item.eventDescription}
                        </p>
                        <p className="text-theme-muted text-xs mt-1 italic leading-relaxed">
                          ↳ Why it mattered: {item.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Tactical Breakdown */}
              {report?.tacticalBreakdown?.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-theme-subtle space-y-4 bg-theme-card">
                  <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    4. Tactical & Analytical Breakdown
                  </h3>
                  <div className="space-y-3">
                    {report.tacticalBreakdown.map((item, idx) => (
                      <div key={idx} className="bg-theme-elevated rounded-xl p-4 border border-theme-subtle space-y-1.5">
                        <h4 className="text-theme-primary text-sm font-bold">{item.subheading}</h4>
                        <p className="text-theme-secondary text-xs leading-relaxed">{item.analysis}</p>
                        {item.supportingData && (
                          <div className="pt-2">
                            <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[11px] font-mono px-2 py-0.5 rounded">
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
                <div className="cricket-card rounded-2xl p-6 border border-theme-subtle space-y-4 bg-theme-card">
                  <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <Quote className="w-4 h-4" /> 5. Verified Quotes & Post-Match Statements
                  </h3>
                  <div className="space-y-3">
                    {report.verifiedQuotes.map((q, idx) => (
                      <blockquote key={idx} className="border-l-3 border-amber-500 pl-4 py-2 bg-theme-elevated rounded-r-xl">
                        <p className="text-theme-primary text-sm italic">"{q.quote}"</p>
                        <footer className="mt-2 text-xs">
                          <span className="text-amber-500 font-bold">— {q.speaker}</span>
                          <span className="text-theme-muted text-[11px] ml-2">({q.context})</span>
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Statistical Highlights */}
              {report?.statHighlights?.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-theme-subtle space-y-4 bg-theme-card">
                  <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" /> 6. Statistical Anomalies
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-theme-subtle text-theme-muted uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 pr-4 font-bold">Metric</th>
                          <th className="py-2.5 pr-4 font-bold text-emerald-600 dark:text-emerald-400">Value</th>
                          <th className="py-2.5 font-bold">Historical Context</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-subtle">
                        {report.statHighlights.map((s, idx) => (
                          <tr key={idx} className="hover:bg-theme-elevated/50">
                            <td className="py-3 pr-4 text-theme-primary font-medium">{s.metric}</td>
                            <td className="py-3 pr-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                              {s.value}
                            </td>
                            <td className="py-3 text-theme-muted">{s.historicalContext}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 7. Curated Visual Archives & Match Photography (When Media Enabled) */}
              {dossier.collectedImages && dossier.collectedImages.length > 0 && (
                <div className="cricket-card rounded-2xl p-6 border border-emerald-500/20 space-y-4 bg-theme-card">
                  <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        7. Archival Photography & Visual Moments
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {dossier.collectedImages.length} High-Res Stills
                    </span>
                  </div>

                  <p className="text-xs text-theme-muted leading-relaxed">
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
                <div className="cricket-card rounded-2xl p-6 border border-theme-subtle space-y-4 bg-theme-card">
                  <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-xs font-bold text-theme-primary uppercase tracking-widest">
                        {dossier.collectedImages?.length > 0 ? '8. Verified Sources & Articles' : '7. Verified Sources & Articles'}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-theme-muted">
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
                          className="bg-theme-elevated hover:bg-theme-hover p-3.5 rounded-xl border border-theme-subtle hover:border-emerald-500/30 flex items-start justify-between gap-3 transition-all group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {domain}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-theme-primary line-clamp-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                              {src.title}
                            </p>
                            <p className="text-[10px] text-theme-muted font-mono truncate mt-1">
                              {src.url}
                            </p>
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-theme-app group-hover:bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5 text-theme-muted group-hover:text-emerald-500" />
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

      {/* ── Footer ── */}
      <footer className="border-t border-theme-subtle py-6 px-6 text-center text-xs text-theme-muted mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <span>CRICSCRIPT AI • ENGINE 01 • DEEP RESEARCH AGENT</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigateLegal?.('privacy')}
              className="hover:text-theme-primary transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigateLegal?.('terms')}
              className="hover:text-theme-primary transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
