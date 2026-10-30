import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Flame, Radio, Award } from 'lucide-react';
import { ThemeToggle } from '../context/ThemeContext';
import Button from '../components/ui/Button';

const STADIUM_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';

export default function LandingView({ onContinue, onNavigateLegal }) {
  return (
    <div className="relative min-h-screen bg-theme-app text-theme-primary flex flex-col justify-between overflow-hidden transition-colors">
      
      {/* ── Background: Ultra-wide Stadium under Floodlights (True 4K 3840x2160) ── */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      >
        <picture className="w-full h-full">
          <source srcSet="/images/cricket/stadium-mcg-4k.webp" type="image/webp" />
          <img
            src="/images/cricket/stadium-mcg-4k.jpg"
            alt="Melbourne Cricket Ground 4K Stadium Floodlights"
            className="w-full h-full object-cover object-center opacity-30 dark:opacity-40 contrast-125 saturate-75"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      </motion.div>

      {/* ── Ambient Video Overlay Layer (Subtle Movement) ── */}
      <video
        src={STADIUM_VIDEO}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none opacity-15 dark:opacity-25 mix-blend-screen"
      />

      {/* ── Multi-Layered Matte Vignette & Linear Fade (Theme Reactive) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'var(--radial-vignette)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, var(--bg-app) 10%, transparent 90%)',
        }}
      />

      {/* ── Top Bar ── */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-theme-elevated border border-theme-subtle flex items-center justify-center text-emerald-500 font-bold shadow-md">
            🏏
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-theme-primary flex items-center gap-2">
              CRICSCRIPT <span className="text-emerald-500 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 font-mono">AI</span>
            </h1>
            <p className="text-[11px] text-theme-muted font-medium tracking-wider uppercase">
              Cricket Documentary Research & Cadence Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-elevated border border-theme-subtle text-xs text-theme-secondary font-medium">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Autonomous Cricket Agents Live</span>
          </div>

          <ThemeToggle />

          <Button
            variant="primary"
            size="sm"
            onClick={onContinue}
            className="tracking-wider uppercase font-bold text-[11px]"
          >
            Enter Studio
          </Button>
        </div>
      </header>

      {/* ── Main Hero Section ── */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col items-center text-center my-auto">
        
        {/* Pitch Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-elevated border border-[#D91F2B]/30 text-white text-xs font-semibold uppercase tracking-widest mb-6 shadow-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#D91F2B] animate-pulse" />
          <span>Stateless AI Studio • Zero Hallucination Fact-Grounding</span>
        </motion.div>

        {/* Big Bold Stadium Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-cricket-title tracking-wide text-theme-primary uppercase leading-[0.95]"
        >
          EVERY BALL. <span className="text-[#D91F2B]">EVERY PULSE.</span> <br />
          EVERY TURNING POINT.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-theme-secondary text-base sm:text-xl max-w-2xl font-normal leading-relaxed"
        >
          Don’t let generic bots spit out flat match summaries. CricScript deploys multi-hop research agents to dissect scorecards, pitch reports, and press conferences — then scripts cinematic documentaries in your authentic creator voice.
        </motion.p>

        {/* Primary Call to Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Button
            variant="primary"
            size="xl"
            onClick={onContinue}
            iconRight={ArrowRight}
            className="w-full sm:w-auto px-10 py-5 text-base tracking-wider uppercase font-bold shadow-xl shadow-[#D91F2B]/30 hover:shadow-[#D91F2B]/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            CONTINUE TO STUDIO
          </Button>
        </motion.div>

        {/* ── CINEMATIC ARCHIVE SHOWCASE: 4 LEGENDARY MATCH MOMENTS ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 w-full max-w-5xl"
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-theme-muted font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ARCHIVED TURNING POINTS READY FOR DEEP INVESTIGATION
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hidden sm:inline">
              4 HISTORIC FEATS LOADED
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            
            {/* Moment 1: Ben Stokes Headingley Roar */}
            <div
              onClick={onContinue}
              className="group relative h-64 rounded-2xl overflow-hidden border border-theme-subtle hover:border-emerald-500/50 bg-theme-card p-4 flex flex-col justify-end text-left cursor-pointer transition-all duration-300 shadow-theme-card"
            >
              <img
                src="/images/cricket/stokes-headingley.jpg"
                alt="Ben Stokes Headingley Miracle"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-50 dark:opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 contrast-125 saturate-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="relative z-10">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                  Headingley 2019
                </span>
                <h4 className="text-xl font-cricket-title tracking-wide text-white uppercase mt-1 leading-tight group-hover:text-emerald-300 transition-colors">
                  Ben Stokes 135*
                </h4>
                <p className="text-[10px] text-slate-200 font-medium truncate mt-0.5">
                  76-run last-wicket miraculous stand
                </p>
              </div>
            </div>

            {/* Moment 2: Sachin Tendulkar No. 10 */}
            <div
              onClick={onContinue}
              className="group relative h-64 rounded-2xl overflow-hidden border border-theme-subtle hover:border-emerald-500/50 bg-theme-card p-4 flex flex-col justify-end text-left cursor-pointer transition-all duration-300 shadow-theme-card"
            >
              <img
                src="/images/cricket/sachin-legend.jpg"
                alt="Sachin Tendulkar No. 10 Salute"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-50 dark:opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 contrast-125 saturate-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="relative z-10">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                  Legend Archive
                </span>
                <h4 className="text-xl font-cricket-title tracking-wide text-white uppercase mt-1 leading-tight group-hover:text-emerald-300 transition-colors">
                  Sachin Tendulkar
                </h4>
                <p className="text-[10px] text-slate-200 font-medium truncate mt-0.5">
                  The iconic No. 10 roar to the crowd
                </p>
              </div>
            </div>

            {/* Moment 3: Yuvraj Singh Kneeling Roar */}
            <div
              onClick={onContinue}
              className="group relative h-64 rounded-2xl overflow-hidden border border-theme-subtle hover:border-emerald-500/50 bg-theme-card p-4 flex flex-col justify-end text-left cursor-pointer transition-all duration-300 shadow-theme-card"
            >
              <img
                src="/images/cricket/yuvraj-six.jpg"
                alt="Yuvraj Singh World Cup Roar"
                className="absolute inset-0 w-full h-full object-cover object-[50%_35%] opacity-50 dark:opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 contrast-125 saturate-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="relative z-10">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                  Motera 2011 QF
                </span>
                <h4 className="text-xl font-cricket-title tracking-wide text-white uppercase mt-1 leading-tight group-hover:text-emerald-300 transition-colors">
                  Yuvraj Singh Roar
                </h4>
                <p className="text-[10px] text-slate-200 font-medium truncate mt-0.5">
                  Dethroning Australia in the World Cup
                </p>
              </div>
            </div>

            {/* Moment 4: Steve Smith Aura */}
            <div
              onClick={onContinue}
              className="group relative h-64 rounded-2xl overflow-hidden border border-theme-subtle hover:border-emerald-500/50 bg-theme-card p-4 flex flex-col justify-end text-left cursor-pointer transition-all duration-300 shadow-theme-card"
            >
              <img
                src="/images/cricket/smith-aura.jpg"
                alt="Steve Smith Ashes Solitary Concentration"
                className="absolute inset-0 w-full h-full object-cover object-[50%_15%] opacity-60 dark:opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500 brightness-135 contrast-110 saturate-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="relative z-10">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                  Edgbaston 2019
                </span>
                <h4 className="text-xl font-cricket-title tracking-wide text-white uppercase mt-1 leading-tight group-hover:text-emerald-300 transition-colors">
                  Steve Smith Aura
                </h4>
                <p className="text-[10px] text-slate-200 font-medium truncate mt-0.5">
                  Twin centuries of solitary defiance
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl"
        >
          <div className="cricket-card rounded-xl p-3.5 text-left border border-theme-subtle bg-theme-card">
            <div className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4" /> Multi-Hop Search
            </div>
            <p className="text-theme-muted text-xs">Scans verified match scorecards & press coverage</p>
          </div>

          <div className="cricket-card rounded-xl p-3.5 text-left border border-theme-subtle bg-theme-card">
            <div className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4" /> 100% Grounded
            </div>
            <p className="text-theme-muted text-xs">Zero hallucinations, strictly validated facts</p>
          </div>

          <div className="cricket-card rounded-xl p-3.5 text-left border border-theme-subtle bg-theme-card">
            <div className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1.5 mb-1">
              <Radio className="w-4 h-4" /> Pitch & Tactics
            </div>
            <p className="text-theme-muted text-xs">Field placements, ball reverse-swing & fatigue</p>
          </div>

          <div className="cricket-card rounded-xl p-3.5 text-left border border-theme-subtle bg-theme-card">
            <div className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4" /> Executive PDF
            </div>
            <p className="text-theme-muted text-xs">Instant high-contrast documentary PDF export</p>
          </div>
        </motion.div>

      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-theme-subtle py-6 px-6 text-center text-xs text-theme-muted">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>CricScript AI • High-Retention Cricket Creator Studio • Stateless • Strictly Fact-Grounded</p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              type="button"
              onClick={() => onNavigateLegal?.('privacy')}
              className="text-theme-muted hover:text-theme-primary transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigateLegal?.('terms')}
              className="text-theme-muted hover:text-theme-primary transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
