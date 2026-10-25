// src/App.jsx
// Root component. Simple two-column layout:
//   Left: ResearchForm (input panel)
//   Right: ResearchDisplay (output panel)

import ResearchForm from './components/ResearchForm/ResearchForm';
import ResearchDisplay from './components/ResearchDisplay/ResearchDisplay';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ── Top Navigation Bar ── */}
      <header className="border-b border-slate-800 px-8 py-4 flex items-center gap-3">
        <span className="text-2xl">🏏</span>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">CricScript AI</h1>
          <p className="text-slate-500 text-xs">Agentic Cricket Research & Scriptwriting Studio</p>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">

        {/* Left panel: always visible input form */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <ResearchForm />
        </aside>

        {/* Right panel: research output viewer */}
        <section>
          <ResearchDisplay />
        </section>

      </main>
    </div>
  );
}
