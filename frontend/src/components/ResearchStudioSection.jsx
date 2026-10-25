import ResearchForm from './ResearchForm/ResearchForm';
import ResearchDisplay from './ResearchDisplay/ResearchDisplay';
import { motion } from 'framer-motion';

export default function ResearchStudioSection({ searchTopic }) {
  return (
    <section id="research-studio" className="relative bg-black py-24 md:py-32 px-6 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-white/40 text-xs tracking-widest uppercase font-semibold">
            Engine 1 • Live Cockpit
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif tracking-tight mt-2">
            Investigative Research Studio
          </h2>
          <p className="text-white/60 text-sm md:text-base mt-4 leading-relaxed">
            Enter any cricket match, over, or controversy. The agent executes multi-hop search across scorecards,
            press conferences, and pitch dynamics to synthesize an unassailable dossier.
          </p>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-8 items-start">
          
          {/* Left: Input Form Panel */}
          <div className="lg:sticky lg:top-8">
            <ResearchForm externalTopic={searchTopic} />
          </div>

          {/* Right: Research Output Dossier Viewer */}
          <div>
            <ResearchDisplay />
          </div>

        </div>

      </div>
    </section>
  );
}
