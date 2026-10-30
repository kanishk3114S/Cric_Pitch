import ResearchForm from './ResearchForm/ResearchForm';
import ResearchDisplay from './ResearchDisplay/ResearchDisplay';

export default function ResearchStudioSection({ searchTopic }) {
  return (
    <section id="research-studio" className="relative bg-theme-app py-24 md:py-32 px-6 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-emerald-600 dark:text-emerald-400 text-xs tracking-widest uppercase font-semibold">
            Engine 1 • Live Cockpit
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-theme-primary font-display tracking-tight mt-2">
            Investigative Research Studio
          </h2>
          <p className="text-theme-muted text-sm md:text-base mt-4 leading-relaxed">
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
