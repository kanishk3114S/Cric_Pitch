import { Globe, Sparkles, Activity } from 'lucide-react';

export default function Navbar({ onLaunchStudio }) {
  return (
    <nav className="relative z-20 px-6 py-6 w-full">
      <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">CricScript</span>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 ml-8">
            <a href="#research-studio" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Research Agent
            </a>
            <a href="#featured" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Cadence RAG
            </a>
            <a href="#philosophy" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Philosophy
            </a>
            <a href="#engines" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Engines
            </a>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-block text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            v2.0 Stateless
          </a>
          <button
            onClick={onLaunchStudio}
            className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            Launch Studio
          </button>
        </div>

      </div>
    </nav>
  );
}
