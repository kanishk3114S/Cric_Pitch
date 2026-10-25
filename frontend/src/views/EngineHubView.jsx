import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, FileText, CheckCircle2, Zap, Sparkles } from 'lucide-react';

export default function EngineHubView({ onBack, onSelectEngine }) {
  return (
    <div className="relative min-h-screen bg-[#030712] text-white flex flex-col justify-between p-6 md:p-12 overflow-hidden">
      
      {/* ── Background: Subdued Stadium Night Backdrop with Vignette ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/images/cricket/stadium-modi.jpg"
          alt="Night Stadium Backdrop"
          className="w-full h-full object-cover object-center opacity-10 contrast-125 saturate-50"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, #030712 75%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]/60" />
      </div>

      {/* ── Top Navigation Bar ── */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between pb-8 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO HOME</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">
            Engine Hub • Control Room
          </span>
        </div>
      </div>

      {/* ── Center Header ── */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto py-10">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full font-mono">
            Autonomous Creator Pipeline
          </span>
          <h2 className="text-4xl md:text-6xl font-cricket-title tracking-wide text-white uppercase mt-4">
            CHOOSE YOUR PRODUCTION ENGINE
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2 leading-relaxed">
            Select a specialized module. Research ground facts first, or generate cadence-matched video scripts.
          </p>
        </div>

        {/* ── The Two Options (Two Div Containers) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* ── CONTAINER 1: RESEARCH ENGINE ── */}
          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => onSelectEngine('research')}
            className="rounded-3xl p-8 md:p-10 border border-white/10 hover:border-emerald-500/50 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all bg-[#090d16] shadow-2xl shadow-black/80"
          >
            {/* Embedded Action Match Moment: Kohli Roar with Directional Matte Mask */}
            <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none overflow-hidden">
              <img
                src="/images/cricket/kohli-roar.jpg"
                alt="Virat Kohli Match Intensity"
                className="w-full h-full object-cover object-[55%_12%] opacity-35 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 contrast-125 saturate-95"
              />
              {/* Matte Gradients: Feathering from left, top, and bottom into #090d16 */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, #090d16 15%, rgba(9,13,22,0.8) 50%, rgba(9,13,22,0.2) 100%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-[#090d16]/60" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Search className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase">
                  Engine 01 • Active Now
                </span>
              </div>

              <h3 className="text-3xl font-cricket-title tracking-wide text-white uppercase group-hover:text-emerald-300 transition-colors">
                CRICKET RESEARCH AGENT
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mt-3 max-w-sm">
                Autonomous investigative agent. Runs multi-hop web searches across scorecards, pitch dynamics,
                and press conferences to compile verified chronologies, tactical nuances, and stats.
              </p>

              {/* Bullet Points */}
              <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multi-query live search (Tavily Search API)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Strict zero-hallucination fact grounding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive timeline, tactical points & verified quotes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>High-contrast, professional PDF report export</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase group-hover:text-emerald-300">
                Launch Research Workspace
              </span>
              <div className="w-10 h-10 rounded-full bg-[#10b981] text-black flex items-center justify-center group-hover:translate-x-1.5 transition-transform shadow-lg shadow-emerald-500/20">
                <ArrowRight className="w-5 h-5 font-bold" />
              </div>
            </div>
          </motion.div>


          {/* ── CONTAINER 2: SCRIPT ENGINE ── */}
          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => onSelectEngine('script')}
            className="rounded-3xl p-8 md:p-10 border border-white/10 hover:border-amber-500/50 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all bg-[#090d16] shadow-2xl shadow-black/80"
          >
            {/* Embedded Action Match Moment: Steve Smith Aura with Directional Matte Mask */}
            <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none overflow-hidden">
              <img
                src="/images/cricket/smith-aura.jpg"
                alt="Steve Smith Aura & Intensity"
                className="w-full h-full object-cover object-[50%_15%] opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 brightness-140 contrast-115 saturate-95"
              />
              {/* Matte Gradients: Feathering from left, top, and bottom into #090d16 */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, #090d16 15%, rgba(9,13,22,0.75) 50%, rgba(9,13,22,0.15) 100%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-[#090d16]/60" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                  Engine 02 • Cadence Studio
                </span>
              </div>

              <h3 className="text-3xl font-cricket-title tracking-wide text-white uppercase group-hover:text-amber-300 transition-colors">
                CADENCE-RAG SCRIPTWRITER
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mt-3 max-w-sm">
                Transfers the acoustic cadence, dramatic pauses, and sentence rhythm of your past reference scripts.
                Generates scene-by-scene voiceover copy with FLUX.1 cinematic camera cues.
              </p>

              {/* Bullet Points */}
              <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pinecone Serverless cadence style vault</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Enforces dramatic [pause] & breath markers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Accepts Engine 1 dossier OR user's own PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>FLUX.1 image prompts + Cloudinary storyboards</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-amber-400 text-xs font-bold tracking-wider uppercase group-hover:text-amber-300">
                Open Script Studio
              </span>
              <div className="w-10 h-10 rounded-full bg-[#f59e0b] text-black flex items-center justify-center group-hover:translate-x-1.5 transition-transform shadow-lg shadow-amber-500/20">
                <ArrowRight className="w-5 h-5 font-bold" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Footer ── */}
      <div className="max-w-6xl mx-auto w-full pt-8 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>CRICSCRIPT AI • STUDIO WORKSPACE</span>
        <span>ZERO AUTH • INSTANT EXECUTION</span>
      </div>

    </div>
  );
}
