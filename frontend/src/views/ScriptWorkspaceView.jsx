import { useState, useEffect } from 'react';
import useScriptStore from '../store/useScriptStore';
import useResearchStore from '../store/useResearchStore';
import { generateScript } from '../services/api';
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  FileText,
  Flame,
  Volume2,
  Database,
  Plus,
  Trash2,
  Import,
  ChevronRight,
  AlertCircle,
  Activity
} from 'lucide-react';

const PRESETS = [
  {
    title: "Virat Kohli 82* vs Pakistan (Melbourne 2022)",
    points: [
      "India 31/4 collapse against Shaheen, Naseem & Haris Rauf",
      "Partnership with Hardik Pandya steadying the ship",
      "The 19th over: 28 needed off 8 balls & that impossible straight six off Rauf",
      "Chaotic 20th over off Nawaz: waist-high no-ball, free hit bye runs, Ashwin calm single"
    ]
  },
  {
    title: "Ben Stokes 135* at Headingley (Ashes 2019)",
    points: [
      "England 67 all-out in first innings; trauma and booing fans",
      "73 runs needed with only Jack Leach remaining for 10th wicket",
      "Jack Leach cleaning his glasses between overs",
      "Stokes exploding with switch-hits and ramp sixes against Cummins & Lyon",
      "Nathan Lyon missed run-out drama and winning boundary through covers"
    ]
  },
  {
    title: "Carlos Brathwaite 2016 Final: 'Remember the Name'",
    points: [
      "19 runs needed in the final over against Ben Stokes at Eden Gardens",
      "Marlon Samuels standing resolute at the non-striker's end",
      "Four consecutive sixes: deep midwicket, long-off, long-on, deep midwicket",
      "Ian Bishop's immortal commentary call: 'Carlos Brathwaite! Remember the name!'"
    ]
  },
  {
    title: "MS Dhoni: The 2011 World Cup Final Six",
    points: [
      "Sehwag & Sachin early dismissal; silent Wankhede Stadium",
      "Gautam Gambhir's fighting 97 under intense Sri Lankan pressure",
      "Dhoni promoting himself ahead of Yuvraj Singh to tackle Muralitharan",
      "The iconic final ball helicopter stroke off Nuwan Kulasekara into the Mumbai night"
    ]
  }
];

export default function ScriptWorkspaceView({ onBack }) {
  const { script, isLoading, error, setScript, setLoading, setError, reset } = useScriptStore();
  const researchDossier = useResearchStore((state) => state.dossier);

  const [topic, setTopic] = useState('');
  const [points, setPoints] = useState([
    'Opening match context & the psychological pressure',
    'Middle-overs struggle and momentum shift',
    'The impossible climax and winning moment'
  ]);
  const [newPoint, setNewPoint] = useState('');
  const [activeTab, setActiveTab] = useState('full'); // 'full' | 'intro' | 'main' | 'outro'
  const [copied, setCopied] = useState(false);
  const [showStyleVault, setShowStyleVault] = useState(false);

  // Live progress ticker
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [progressStep, setProgressStep] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    const step1 = setTimeout(() => setProgressStep(1), 2500);
    const step2 = setTimeout(() => setProgressStep(2), 7000);
    const step3 = setTimeout(() => setProgressStep(3), 13000);

    return () => {
      clearInterval(timer);
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  }, [isLoading]);

  // Apply a historical preset
  const handleSelectPreset = (preset) => {
    setTopic(preset.title);
    setPoints(preset.points);
    setError(null);
  };

  // Import from Engine 01 research dossier if available
  const handleImportResearch = () => {
    if (!researchDossier) return;
    setTopic(researchDossier.topic || '');
    setError(null);
    const importedPoints = [];
    if (researchDossier.synthesizedReport?.keyChronology?.length) {
      researchDossier.synthesizedReport.keyChronology.slice(0, 4).forEach((k) => {
        importedPoints.push(`${k.timestampOrDate}: ${k.eventDescription}`);
      });
    }
    if (importedPoints.length) {
      setPoints(importedPoints);
    }
  };

  const handleAddPoint = () => {
    if (!newPoint.trim()) return;
    setPoints([...points, newPoint.trim()]);
    setNewPoint('');
  };

  const handleRemovePoint = (index) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  // Generate Script Handler
  const handleGenerate = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!topic || !topic.trim()) {
      setError('Please enter a match topic or click one of the benchmark presets above.');
      return;
    }

    setScript(null);
    setLoading(true);
    setError(null);
    setElapsedSeconds(0);
    setProgressStep(0);

    try {
      const response = await generateScript({
        topic: topic.trim(),
        keyPoints: points.filter(Boolean),
        researchDossier: researchDossier || null
      });

      if (response.data?.success && response.data?.data) {
        setScript(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to generate script');
      }
    } catch (err) {
      console.error('Script generation error:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Script generation failed. Please verify the backend is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Copy Full Script
  const handleCopy = () => {
    if (!script) return;
    const fullText = `CRICSCRIPT AI — VOICE-OVER TELEPROMPTER COPY
TITLE: ${script.title}
WORD COUNT: ${script.wordCount} words | DURATION: ${script.estimatedDurationMinutes}

========================================
PART 1: INTRO (THE HOOK & STAKES)
========================================
${script.sections?.intro || ''}

========================================
PART 2: MAIN (THE BATTLE & TURNAROUND)
========================================
${script.sections?.main || ''}

========================================
PART 3: OUTRO (THE CLIMAX & LEGACY)
========================================
${script.sections?.outro || ''}
`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Script as TXT
  const handleDownload = () => {
    if (!script) return;
    const fullText = `# ${script.title}
Generated by CricScript AI — Cadence-RAG Studio
Word Count: ${script.wordCount} words | Estimated Duration: ${script.estimatedDurationMinutes}

## PART 1: INTRO
${script.sections?.intro || ''}

## PART 2: MAIN
${script.sections?.main || ''}

## PART 3: OUTRO
${script.sections?.outro || ''}
`;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(script.title || 'Cricket-Script').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Formats text and highlights [pause] markers nicely
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    return (
      <div className="space-y-4 text-slate-100 text-base md:text-lg leading-relaxed md:leading-loose font-normal">
        {rawText.split('\n\n').map((paragraph, pIdx) => {
          const words = paragraph.split(/(\[pause\])/g);
          return (
            <p key={pIdx}>
              {words.map((chunk, cIdx) => {
                if (chunk === '[pause]') {
                  return (
                    <span
                      key={cIdx}
                      className="inline-flex items-center gap-1 mx-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold uppercase tracking-wider select-none align-middle shadow-sm shadow-amber-500/10"
                    >
                      <Volume2 className="w-3 h-3 text-amber-400" />
                      <span>pause</span>
                    </span>
                  );
                }
                return chunk;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      {/* ── TOP CONTROL ROOM NAVIGATION ── */}
      <header className="sticky top-0 z-50 bg-[#030712]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO HUB</span>
            </button>
            <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-cricket-title tracking-wider text-xl text-white uppercase">
                ENGINE 02
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                CADENCE-RAG SCRIPT STUDIO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-[11px] font-mono text-slate-400">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>PINECONE STYLE VAULT LIVE (19 CHUNKS)</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono font-semibold text-amber-300">
              1,000 WORDS LIMIT
            </div>
          </div>
        </div>
      </header>

      {/* ── WORKSPACE SPLIT CANVAS ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT COLUMN: DIRECTORIAL CONTROL BRIEF (5 cols) ── */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Quick Presets Carousel / Bar */}
          <div className="rounded-2xl border border-white/10 bg-[#090d16] p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                HISTORICAL BENCHMARK PRESETS
              </span>
              {researchDossier && (
                <button
                  type="button"
                  onClick={handleImportResearch}
                  className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline underline-offset-2 cursor-pointer"
                >
                  <Import className="w-3 h-3" />
                  Load Engine 1 Dossier
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    topic === p.title
                      ? 'border-amber-500/60 bg-amber-500/15 text-white font-semibold'
                      : 'border-white/5 bg-slate-900/60 text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <p className="line-clamp-2 leading-snug">{p.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Brief Container */}
          <form
            onSubmit={handleGenerate}
            className="rounded-3xl border border-white/10 bg-[#090d16] p-6 md:p-7 shadow-2xl space-y-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-cricket-title tracking-wide text-white uppercase">
                  DIRECTORIAL SCRIPT BRIEF
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Voiceover rhythm mapped to your Hinglish creator style.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <div className="flex-1">
                  <p className="font-semibold text-red-200">Attention Required</p>
                  <p className="leading-relaxed mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Field 1: Topic */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>1. DOCUMENTARY MATCH / TOPIC</span>
                <span className="text-[10px] text-amber-400/80 font-bold">* REQUIRED</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Virat Kohli 82* vs Pakistan: The Melbourne Miracle"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
              />
            </div>

            {/* Field 2: Key Angles & Story Beats */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>2. KEY ANGLES & DRAMATIC MOMENTS</span>
                <span className="text-[10px] text-slate-500 font-normal">({points.length} beats)</span>
              </label>

              {/* Point Items List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {points.map((pt, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-300 group hover:border-white/20 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 leading-snug line-clamp-2">{pt}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(i)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                      title="Remove angle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Point Bar */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPoint();
                    }
                  }}
                  placeholder="Add specific moment (e.g. Haris Rauf 19th over six)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-500 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddPoint}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD</span>
                </button>
              </div>
            </div>

            {/* Architecture Details Pill */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5 text-[11px] font-mono text-slate-400">
              <div className="flex items-center justify-between">
                <span>RAG Retrieval:</span>
                <span className="text-amber-400 font-semibold">Pinecone Hybrid (19 Chunks)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Voice Architecture:</span>
                <span className="text-slate-200">3 Parts (Intro • Main • Outro)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Language & Slang:</span>
                <span className="text-slate-200">Authentic Hinglish + [pause] cues</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 disabled:cursor-not-allowed text-black font-cricket-title text-xl tracking-wider uppercase transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>SYNTHESIZING HINGLISH SCRIPT ({elapsedSeconds}s)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>GENERATE HINGLISH SCRIPT</span>
                </>
              )}
            </button>
          </form>

        </section>


        {/* ── RIGHT COLUMN: TELEPROMPTER & SCRIPT VIEWER (7 cols) ── */}
        <section className="lg:col-span-7">

          {/* ── EMPTY STATE (No script yet) ── */}
          {!script && !isLoading && (
            <div className="rounded-3xl border border-white/10 bg-[#090d16] p-8 md:p-12 relative overflow-hidden shadow-2xl min-h-[580px] flex flex-col justify-between">
              
              {/* Background Feathered Artwork: Steve Smith Intensity */}
              <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                <img
                  src="/images/cricket/smith-aura.jpg"
                  alt="Steve Smith Intensity"
                  className="w-full h-full object-cover object-[60%_20%] opacity-20 contrast-125 saturate-75 brightness-125"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at center, transparent 20%, #090d16 85%)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/70 to-[#090d16]/40" />
              </div>

              <div className="relative z-10 max-w-lg">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                  <Volume2 className="w-6 h-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-cricket-title tracking-wide text-white uppercase leading-tight">
                  HINGLISH VOICE-OVER STUDIO READY
                </h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mt-3">
                  This studio does not write generic expository essays. It retrieves your actual cadence,
                  dramatic breath pauses, and storytelling slang from your Pinecone library and writes
                  a tight 3-part script ready for recording.
                </p>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Part 1: The Hook & Psychological Stakes (~150 words)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Part 2: The Ball-by-Ball Battle & Climax (~600 words)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Part 3: Emotional Payoff & Legacy Resolution (~150 words)</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>MAX WORD TARGET: ~850–1000 WORDS</span>
                <span>ZERO DRIFT • GROUNDED FACTUALITY</span>
              </div>
            </div>
          )}

          {/* ── LOADING STATE (Animated Radar & Thought Stream) ── */}
          {isLoading && (
            <div className="rounded-3xl border border-amber-500/30 bg-[#090d16] p-10 md:p-14 relative overflow-hidden shadow-2xl min-h-[580px] flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-amber-400/40 animate-pulse" />
                <div className="w-full h-full rounded-full bg-amber-500/10 border border-amber-500/50 flex items-center justify-center text-amber-400">
                  <Activity className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase mb-3">
                RAG INFERENCE IN PROGRESS • {elapsedSeconds}S
              </span>
              <h3 className="text-2xl font-cricket-title tracking-wide text-white uppercase max-w-md">
                PULLING YOUR AUTHENTIC CADENCE FROM PINECONE
              </h3>

              {/* Dynamic Step Tracker */}
              <div className="mt-8 max-w-sm w-full space-y-3 text-left">
                <div className={`flex items-center gap-3 text-xs p-2.5 rounded-xl border transition-all ${
                  progressStep === 0
                    ? 'border-amber-400/60 bg-amber-500/10 text-amber-200'
                    : 'border-white/5 bg-slate-950/60 text-slate-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${progressStep === 0 ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span>1. Searching Pinecone index "cricscript-rag"...</span>
                </div>

                <div className={`flex items-center gap-3 text-xs p-2.5 rounded-xl border transition-all ${
                  progressStep === 1
                    ? 'border-amber-400/60 bg-amber-500/10 text-amber-200'
                    : progressStep > 1 ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-white/5 bg-slate-950/60 text-slate-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${progressStep === 1 ? 'bg-amber-400 animate-pulse' : progressStep > 1 ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span>2. Matching Hinglish voiceover rhythm & pause cues...</span>
                </div>

                <div className={`flex items-center gap-3 text-xs p-2.5 rounded-xl border transition-all ${
                  progressStep >= 2
                    ? 'border-amber-400/60 bg-amber-500/10 text-amber-200'
                    : 'border-white/5 bg-slate-950/60 text-slate-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${progressStep >= 2 ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span>3. Synthesizing 3-part script (Intro, Main, Outro)...</span>
                </div>
              </div>
            </div>
          )}

          {/* ── GENERATED SCRIPT TELEPROMPTER VIEW ── */}
          {script && !isLoading && (
            <div className="rounded-3xl border border-white/10 bg-[#090d16] shadow-2xl overflow-hidden flex flex-col">
              
              {/* Header Bar */}
              <div className="p-6 md:p-8 border-b border-white/10 bg-slate-950/70">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      VOICEOVER READY
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {script.wordCount} WORDS • {script.estimatedDurationMinutes}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'COPIED!' : 'COPY'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-mono font-semibold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>DOWNLOAD .MD</span>
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Clear & Start New Script"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-cricket-title tracking-wide text-white uppercase leading-tight">
                  {script.title}
                </h1>
              </div>

              {/* Section Navigation Tabs */}
              <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/5 bg-slate-950/40 text-xs font-mono">
                {[
                  { key: 'full', label: 'FULL SCRIPT' },
                  { key: 'intro', label: 'PART 1: INTRO' },
                  { key: 'main', label: 'PART 2: MAIN' },
                  { key: 'outro', label: 'PART 3: OUTRO' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-3 px-3 border-b-2 font-bold tracking-wider transition-colors cursor-pointer ${
                      activeTab === tab.key
                        ? 'border-amber-400 text-amber-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Teleprompter Content Canvas */}
              <div className="p-6 md:p-8 space-y-8 max-h-[640px] overflow-y-auto">
                {activeTab === 'full' && (
                  <>
                    <div className="space-y-3 pb-6 border-b border-white/5">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                        PART 1: INTRO (THE HOOK & STAKES)
                      </span>
                      {renderFormattedText(script.sections?.intro)}
                    </div>

                    <div className="space-y-3 pb-6 border-b border-white/5">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                        PART 2: MAIN (THE BATTLE & TURNAROUND)
                      </span>
                      {renderFormattedText(script.sections?.main)}
                    </div>

                    <div className="space-y-3">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                        PART 3: OUTRO (THE CLIMAX & LEGACY)
                      </span>
                      {renderFormattedText(script.sections?.outro)}
                    </div>
                  </>
                )}

                {activeTab === 'intro' && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                      PART 1: INTRO (THE HOOK & STAKES)
                    </span>
                    {renderFormattedText(script.sections?.intro)}
                  </div>
                )}

                {activeTab === 'main' && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                      PART 2: MAIN (THE BATTLE & TURNAROUND)
                    </span>
                    {renderFormattedText(script.sections?.main)}
                  </div>
                )}

                {activeTab === 'outro' && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                      PART 3: OUTRO (THE CLIMAX & LEGACY)
                    </span>
                    {renderFormattedText(script.sections?.outro)}
                  </div>
                )}
              </div>

              {/* Matched Pinecone Style Vault Exemplars Dropdown / Footer */}
              {script.matchedStyleChunks?.length > 0 && (
                <div className="p-4 border-t border-white/10 bg-slate-950/90 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setShowStyleVault(!showStyleVault)}
                    className="w-full flex items-center justify-between text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-amber-400" />
                      <span>RETRIEVED PINECONE STYLE CHUNKS ({script.matchedStyleChunks.length})</span>
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${showStyleVault ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {showStyleVault && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-white/5">
                      {script.matchedStyleChunks.map((chunk, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-[11px] text-slate-300"
                        >
                          <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                            <span>{chunk.id}</span>
                            <span>Score: {chunk.score?.toFixed(4)}</span>
                          </div>
                          <p className="line-clamp-2 text-slate-400 leading-snug">{chunk.sample}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}
