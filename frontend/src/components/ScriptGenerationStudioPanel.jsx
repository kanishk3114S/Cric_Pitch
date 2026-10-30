import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  FileText,
  Volume2,
  CheckCircle2,
  Flame,
  Radio,
  BookOpen,
  Mic,
  Cpu
} from 'lucide-react';

const WORKFLOW_STAGES = [
  {
    id: 'init',
    title: 'Initializing Script Generation',
    tag: 'Stage 1 of 5',
    description: 'Calibrating documentary tone, word budget (<1,000 words), and voiceover parameters.',
    icon: Sparkles,
    thresholdSeconds: 0,
  },
  {
    id: 'sources',
    title: 'Processing Research & Source Material',
    tag: 'Stage 2 of 5',
    description: 'Ingesting verified match chronologies, turning points, and authentic cadence exemplars.',
    icon: BookOpen,
    thresholdSeconds: 3,
  },
  {
    id: 'structure',
    title: 'Structuring Documentary Narrative',
    tag: 'Stage 3 of 5',
    description: 'Constructing 3-act tension arc: The Hook & Stakes → Tactical Duel → Legacy Payoff.',
    icon: Layers,
    thresholdSeconds: 8,
  },
  {
    id: 'synthesis',
    title: 'Generating the Script',
    tag: 'Stage 4 of 5',
    description: 'Synthesizing conversational Hinglish voiceover with staccato phrasing & [pause] acoustic cues.',
    icon: Mic,
    thresholdSeconds: 14,
  },
  {
    id: 'finalizing',
    title: 'Finalizing Output & Teleprompter Flow',
    tag: 'Stage 5 of 5',
    description: 'Verifying teleprompter pacing, acoustic breath markers, and strict word count discipline.',
    icon: FileText,
    thresholdSeconds: 20,
  },
];

const NARRATIVE_INSIGHTS = [
  'Pro Tip: Authentic [pause] markers allow stadium ambience and crowd roar to breathe through.',
  'Hook Rule: The first 10 seconds establish historical stakes before ball-by-ball tension begins.',
  'Tactical Arc: Contrast bowling strategy (seam/swing) with batsman psychological resilience.',
  'Hinglish Flow: Weave conversational Hindi emotion with crisp cricket analytical vocabulary.',
  'Retention Discipline: Capping commentary under 1,000 words prevents video retention drop-off.',
];

export default function ScriptGenerationStudioPanel({ topic, elapsedSeconds = 0 }) {
  // Determine active illustrative stage based on elapsed time
  let currentStageIndex = 0;
  for (let i = WORKFLOW_STAGES.length - 1; i >= 0; i--) {
    if (elapsedSeconds >= WORKFLOW_STAGES[i].thresholdSeconds) {
      currentStageIndex = i;
      break;
    }
  }

  // Rotate narrative insights
  const [insightIndex, setInsightIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % NARRATIVE_INSIGHTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-3xl border border-amber-500/35 bg-theme-card p-6 md:p-8 overflow-hidden shadow-theme-card flex flex-col justify-between min-h-[620px] transition-all">
      
      {/* ── Ambient Background Lighting & Subtle Pattern ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 dark:opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-15 dark:opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Studio Header Bar ── */}
      <div className="relative z-10 pb-5 border-b border-theme-subtle flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>AI SCRIPT ENGINE ACTIVE • {elapsedSeconds}S</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-elevated border border-theme-subtle text-xs font-mono text-theme-muted">
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            <span>Gemini 3.8 Flash</span>
          </div>
        </div>

        {/* Acoustic Audio Equalizer Waveform */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-theme-elevated border border-theme-subtle shadow-sm">
          <Volume2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[10px] font-mono text-theme-secondary font-semibold uppercase tracking-wider">
            Voiceover Cadence
          </span>
          <div className="flex items-center gap-1 h-5 pl-1">
            <span className="w-1 bg-amber-500 rounded-full wave-bar-1" />
            <span className="w-1 bg-emerald-500 rounded-full wave-bar-2" />
            <span className="w-1 bg-amber-400 rounded-full wave-bar-3" />
            <span className="w-1 bg-emerald-400 rounded-full wave-bar-4" />
            <span className="w-1 bg-amber-500 rounded-full wave-bar-5" />
          </div>
        </div>
      </div>

      {/* ── Topic Focus Banner ── */}
      <div className="relative z-10 my-4 p-4 rounded-2xl bg-theme-elevated/70 border border-theme-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500 block mb-0.5">
            Documentary Project Focus
          </span>
          <h3 className="text-sm md:text-base font-bold text-theme-primary truncate">
            {topic || 'Cricket Documentary Script'}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-theme-card border border-theme-subtle text-theme-secondary">
            Target: ~850–1,000 Words
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
            3 Acts
          </span>
        </div>
      </div>

      {/* ── Workflow Stages Stepper (Illustrative Workflow States) ── */}
      <div className="relative z-10 space-y-2.5 my-2">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            WORKFLOW PIPELINE PROGRESSION
          </span>
          <span className="text-[11px] font-mono text-amber-500 font-bold">
            Phase {currentStageIndex + 1} of {WORKFLOW_STAGES.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {WORKFLOW_STAGES.map((stage, idx) => {
            const isCompleted = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;
            const Icon = stage.icon;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : isCompleted
                    ? 'bg-theme-elevated/80 border-emerald-500/30 text-theme-secondary'
                    : 'bg-theme-elevated/30 border-theme-subtle/50 opacity-50 text-theme-muted'
                }`}
              >
                {/* Stage Status Icon */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-500">
                      <Icon className="w-4 h-4 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-theme-sunken border border-theme-subtle flex items-center justify-center text-theme-dim">
                      <span className="text-xs font-mono font-bold">{idx + 1}</span>
                    </div>
                  )}
                </div>

                {/* Stage Text & Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs md:text-sm font-bold ${
                      isCurrent
                        ? 'text-amber-600 dark:text-amber-300'
                        : isCompleted
                        ? 'text-theme-primary'
                        : 'text-theme-muted'
                    }`}>
                      {stage.title}
                    </h4>
                    <span className="text-[10px] font-mono text-theme-dim shrink-0">
                      {stage.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-theme-muted mt-0.5 leading-snug">
                    {stage.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Dynamic Live Shimmer Teleprompter Skeleton ── */}
      <div className="relative z-10 my-3 p-4 rounded-2xl bg-theme-elevated/50 border border-theme-subtle space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-theme-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Synthesizing 3-Part Teleprompter Copy...
          </span>
          <span className="font-bold text-theme-secondary">Part {Math.min(currentStageIndex + 1, 3)} of 3</span>
        </div>
        <div className="h-2 w-full rounded-full bg-theme-sunken overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500"
            style={{
              width: `${Math.min(15 + elapsedSeconds * 4, 96)}%`,
            }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </div>

      {/* ── Long-Running Request Helper Notification ── */}
      {elapsedSeconds >= 15 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 mb-2"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>
            Deep documentary synthesis underway — Gemini is fine-tuning staccato pauses and conversational pacing.
          </span>
        </motion.div>
      )}

      {/* ── Rotating Narrative Wisdom / Advice Footer ── */}
      <div className="relative z-10 pt-4 border-t border-theme-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-theme-muted font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={insightIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] text-theme-secondary truncate max-w-md"
            >
              {NARRATIVE_INSIGHTS[insightIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            Zero Hallucination
          </span>
          <span>•</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            Cadence Grounded
          </span>
        </div>
      </div>

    </div>
  );
}
