import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, FileText, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../context/ThemeContext';

export default function EngineHubView({ onBack, onSelectEngine }) {
  return (
    <div className="relative min-h-screen bg-theme-app text-theme-primary flex flex-col justify-between p-6 md:p-12 overflow-hidden transition-colors">
      
      {/* ── Background: Subdued Stadium Backdrop with Theme-Adaptive Vignette ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/images/cricket/stadium-modi.jpg"
          alt="Night Stadium Backdrop"
          className="w-full h-full object-cover object-center opacity-10 dark:opacity-20 contrast-125 saturate-50"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--radial-vignette)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, var(--bg-app) 15%, transparent 85%)',
          }}
        />
      </div>

      {/* ── Top Navigation Bar ── */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between pb-8 border-b border-theme-subtle">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-theme-muted hover:text-theme-primary transition-colors cursor-pointer group px-3.5 py-1.5 rounded-lg bg-theme-elevated border border-theme-subtle hover:border-theme-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO HOME</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-elevated border border-theme-subtle">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-theme-secondary uppercase tracking-wider">
              Engine Hub • Control Room
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* ── Center Header ── */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto py-10">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full font-mono">
            Autonomous Creator Pipeline
          </span>
          <h2 className="text-4xl md:text-6xl font-cricket-title tracking-wide text-theme-primary uppercase mt-4">
            CHOOSE YOUR PRODUCTION ENGINE
          </h2>
          <p className="text-theme-muted text-sm md:text-base mt-2 leading-relaxed">
            Select a specialized module. Research ground facts first, or generate cadence-matched video scripts.
          </p>
        </div>

        {/* ── The Two Options (Two Div Containers) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* ── CONTAINER 1: RESEARCH ENGINE ── */}
          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => onSelectEngine('research')}
            className="rounded-3xl p-8 md:p-10 border border-theme-subtle hover:border-emerald-500/50 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all bg-theme-card shadow-theme-card"
          >
            {/* Embedded Action Match Moment: Kohli Roar with Directional Matte Mask */}
            <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none overflow-hidden">
              <img
                src="/images/cricket/kohli-roar.jpg"
                alt="Virat Kohli Match Intensity"
                className="w-full h-full object-cover object-[55%_12%] opacity-25 dark:opacity-35 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 contrast-125 saturate-95"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'var(--matte-gradient)',
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, var(--bg-card) 10%, transparent 90%)',
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <Search className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 uppercase">
                  Engine 01 • Active Now
                </span>
              </div>

              <h3 className="text-3xl font-cricket-title tracking-wide text-theme-primary uppercase group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                CRICKET RESEARCH AGENT
              </h3>

              <p className="text-theme-secondary text-sm leading-relaxed mt-3 max-w-sm">
                Autonomous investigative agent. Runs multi-hop web searches across scorecards, pitch dynamics,
                and press conferences to compile verified chronologies, tactical nuances, and stats.
              </p>

              {/* Bullet Points */}
              <div className="mt-6 space-y-2.5 text-xs text-theme-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Multi-query live search across cricket archives</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Strict zero-hallucination fact grounding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Interactive timeline, tactical points & verified quotes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>High-contrast, professional PDF report export</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="relative z-10 mt-8 pt-6 border-t border-theme-subtle flex items-center justify-between">
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase group-hover:text-emerald-500">
                Launch Research Workspace
              </span>
              <div className="w-10 h-10 rounded-full btn-emerald-glow flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                <ArrowRight className="w-5 h-5 font-bold" />
              </div>
            </div>
          </motion.div>


          {/* ── CONTAINER 2: HINGLISH CADENCE SCRIPT STUDIO ── */}
          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => onSelectEngine('script')}
            className="rounded-3xl p-8 md:p-10 border border-theme-subtle hover:border-amber-500/50 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all bg-theme-card shadow-theme-card"
          >
            {/* Embedded Action Match Moment: Steve Smith Aura with Directional Matte Mask */}
            <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none overflow-hidden">
              <img
                src="/images/cricket/smith-aura.jpg"
                alt="Steve Smith Aura & Intensity"
                className="w-full h-full object-cover object-[50%_15%] opacity-30 dark:opacity-40 group-hover:opacity-55 transition-all duration-700 brightness-125 contrast-115 saturate-95"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'var(--matte-gradient)',
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, var(--bg-card) 10%, transparent 90%)',
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 uppercase">
                  Engine 02 • Active Now
                </span>
              </div>

              <h3 className="text-3xl font-cricket-title tracking-wide text-theme-primary uppercase group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
                MATCH SCRIPTWRITER
              </h3>

              <p className="text-theme-secondary text-sm leading-relaxed mt-3 max-w-sm">
                Transfers the acoustic cadence, dramatic pauses, and sentence rhythm of your past reference scripts.
                Generates 3-part Hinglish voiceover copy with dramatic [pause] cues under 1,000 words.
              </p>

              {/* Bullet Points */}
              <div className="mt-6 space-y-2.5 text-xs text-theme-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Authentic Hinglish Video-Essay Cadence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Enforces dramatic [pause] & breath markers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Structured 3-part layout: Intro, Main, Outro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Paced narration strictly under 1,000 words</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="relative z-10 mt-8 pt-6 border-t border-theme-subtle flex items-center justify-between">
              <span className="text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wider uppercase group-hover:text-amber-500">
                Launch Script Studio
              </span>
              <div className="w-10 h-10 rounded-full btn-amber-glow flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                <ArrowRight className="w-5 h-5 font-bold" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Footer ── */}
      <div className="max-w-6xl mx-auto w-full pt-8 border-t border-theme-subtle flex items-center justify-between text-xs text-theme-muted font-mono">
        <span>CRICSCRIPT AI • STUDIO WORKSPACE</span>
        <span>ZERO AUTH • INSTANT EXECUTION</span>
      </div>

    </div>
  );
}
