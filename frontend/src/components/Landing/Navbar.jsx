import { Sparkles, Activity } from 'lucide-react';
import { ThemeToggle } from '../../context/ThemeContext';

export default function Navbar({ onLaunchStudio }) {
  return (
    <nav className="relative z-30 px-6 py-6 w-full">
      <div className="rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between bg-theme-card/80 dark:bg-black/60 backdrop-blur-xl border border-theme-subtle shadow-theme-card transition-colors">
        
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-theme-primary">
            Cric<span className="text-emerald-600 dark:text-emerald-400">Pitch</span>
          </span>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 ml-8">
            <a href="#about" className="text-theme-secondary hover:text-theme-primary text-sm font-medium transition-colors">
              Directorial Standard
            </a>
            <a href="#featured" className="text-theme-secondary hover:text-theme-primary text-sm font-medium transition-colors">
              Story Studio
            </a>
            <a href="#philosophy" className="text-theme-secondary hover:text-theme-primary text-sm font-medium transition-colors">
              Narrative Craft
            </a>
            <a href="#engines" className="text-theme-secondary hover:text-theme-primary text-sm font-medium transition-colors">
              Production Engines
            </a>
          </div>
        </div>

        {/* Right CTA & Theme Toggle */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-theme-elevated text-theme-muted border border-theme-subtle">
            v2.0 Autonomous
          </span>
          
          <ThemeToggle />

          <button
            onClick={onLaunchStudio}
            className="btn-emerald-glow rounded-full px-5 py-2 text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Studio</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
