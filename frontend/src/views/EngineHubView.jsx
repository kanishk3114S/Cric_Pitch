import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, FileText, CheckCircle2, Zap, Sparkles } from 'lucide-react';

export default function EngineHubView({ onBack, onSelectEngine }) {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between p-6 md:p-12">
      
      {/* ── Top Navigation Bar ── */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between pb-8 border-b border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO HOME</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Engine Hub • Stateless Studio
          </span>
        </div>
      </div>

      {/* ── Center Header ── */}
      <div className="max-w-5xl mx-auto w-full my-auto py-10">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Autonomous Creator Pipeline
          </span>
          <h2 className="text-4xl md:text-6xl font-cricket-title tracking-wide text-white uppercase mt-4">
            CHOOSE YOUR PRODUCTION ENGINE
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            Select a specialized module. Research ground facts first, or generate cadence-matched video scripts.
          </p>
        </div>

        {/* ── The Two Options (Two Div Containers) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* ── CONTAINER 1: RESEARCH ENGINE ── */}
          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => onSelectEngine('research')}
            className="cricket-card cricket-card-glow rounded-3xl p-8 md:p-10 border border-emerald-500/30 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950"
          >
            {/* Emerald ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/15 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Search className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase">
                  Engine 01 • Active Now
                </span>
              </div>

              <h3 className="text-3xl font-cricket-title tracking-wide text-white uppercase">
                CRICKET RESEARCH AGENT
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mt-3">
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
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase group-hover:text-emerald-300">
                Launch Research Workspace
              </span>
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5 font-bold" />
              </div>
            </div>
          </motion.div>


          {/* ── CONTAINER 2: SCRIPT ENGINE ── */}
          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => onSelectEngine('script')}
            className="cricket-card cricket-card-glow rounded-3xl p-8 md:p-10 border border-amber-500/20 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950"
          >
            {/* Amber ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-500/15 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                  Engine 02 • Cadence Studio
                </span>
              </div>

              <h3 className="text-3xl font-cricket-title tracking-wide text-white uppercase">
                CADENCE-RAG SCRIPTWRITER
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mt-3">
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
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-amber-400 text-xs font-bold tracking-wider uppercase group-hover:text-amber-300">
                Open Script Studio
              </span>
              <div className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center group-hover:translate-x-1 transition-transform">
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
