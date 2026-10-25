import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Flame, Radio, Award } from 'lucide-react';

const STADIUM_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';

export default function LandingView({ onContinue }) {
  return (
    <div className="relative min-h-screen bg-[#030712] text-white flex flex-col justify-between overflow-hidden">
      
      {/* ── Background: Ultra-wide Night Stadium under Floodlights with Slow Camera Pan ── */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      >
        <img
          src="/images/cricket/stadium-mcg.jpg"
          alt="Melbourne Cricket Ground Night Stadium Floodlights"
          className="w-full h-full object-cover object-center opacity-40 contrast-125 saturate-75"
        />
      </motion.div>

      {/* ── Ambient Video Overlay Layer (Subtle Movement) ── */}
      <video
        src={STADIUM_VIDEO}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none opacity-25 mix-blend-screen"
      />

      {/* ── Multi-Layered Matte Vignette & Linear Fade (Zero Harsh Edges) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 15%, #030712 82%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/75 to-transparent pointer-events-none" />

      {/* ── Top Bar ── */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400 font-bold shadow-lg">
            🏏
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              CRICSCRIPT <span className="text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 font-mono">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">
              Cricket Documentary Research & Cadence Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs text-slate-300 font-medium">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Autonomous Cricket Agents Live</span>
          </div>

          <button
            onClick={onContinue}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-[#10b981] hover:text-black border border-white/15 text-white text-xs font-bold tracking-wide transition-all cursor-pointer"
          >
            Enter Studio
          </button>
        </div>
      </header>

      {/* ── Main Hero Section ── */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col items-center text-center my-auto">
        
        {/* Pitch Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-6 shadow-lg shadow-black/60"
        >
          <Flame className="w-4 h-4 text-emerald-400" />
          <span>Stateless AI Studio • Zero Hallucination Fact-Grounding</span>
        </motion.div>

        {/* Big Bold Stadium Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-cricket-title tracking-wide text-white uppercase leading-[0.95]"
        >
          EVERY BALL. <span className="text-emerald-400">EVERY PULSE.</span> <br />
          EVERY TURNING POINT.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-slate-300 text-base sm:text-xl max-w-2xl font-normal leading-relaxed"
        >
          Don’t let generic AI spit out flat match summaries. CricScript deploys multi-hop research agents to dissect scorecards, pitch reports, and press conferences — then scripts cinematic documentaries with your personal cadence.
        </motion.p>

        {/* Primary Call to Action Button (Solid Authoritative Turf Emerald, Zero Cheesy Gradients) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-black font-extrabold text-base tracking-wider uppercase flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <span>CONTINUE TO STUDIO</span>
            <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl"
        >
          <div className="cricket-card rounded-xl p-3.5 text-left border border-white/10 bg-slate-900/90">
            <div className="text-emerald-400 text-sm font-bold flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4" /> Multi-Hop Search
            </div>
            <p className="text-slate-400 text-xs">Tavily scans verified match scorecards & news</p>
          </div>

          <div className="cricket-card rounded-xl p-3.5 text-left border border-white/10 bg-slate-900/90">
            <div className="text-emerald-400 text-sm font-bold flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4" /> 100% Grounded
            </div>
            <p className="text-slate-400 text-xs">Zero hallucinations, strictly validated facts</p>
          </div>

          <div className="cricket-card rounded-xl p-3.5 text-left border border-white/10 bg-slate-900/90">
            <div className="text-emerald-400 text-sm font-bold flex items-center gap-1.5 mb-1">
              <Radio className="w-4 h-4" /> Pitch & Tactics
            </div>
            <p className="text-slate-400 text-xs">Field placements, ball reverse-swing & fatigue</p>
          </div>

          <div className="cricket-card rounded-xl p-3.5 text-left border border-white/10 bg-slate-900/90">
            <div className="text-emerald-400 text-sm font-bold flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4" /> Executive PDF
            </div>
            <p className="text-slate-400 text-xs">Instant high-contrast documentary PDF export</p>
          </div>
        </motion.div>

      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 py-6 px-6 text-center text-xs text-slate-500">
        <p>CricScript AI • Stateless Cricket Creator Studio • No Auth • No Database Bloat</p>
      </footer>

    </div>
  );
}
