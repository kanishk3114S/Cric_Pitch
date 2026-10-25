// src/components/ResearchDisplay/ResearchDisplay.jsx
// Renders the compiled dossier beautifully in the app.
// Each section (summary, timeline, quotes, stats) gets its own styled block.

import useResearchStore from '../../store/useResearchStore';
import { exportToPDF } from '../../services/api';

export default function ResearchDisplay() {
  const { dossier, error, isLoading } = useResearchStore();

  // ── Helper: trigger PDF download in browser ──────────────────────────────
  const handlePDFDownload = async () => {
    try {
      const response = await exportToPDF(dossier);
      // Create a temporary URL from the binary blob data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `CricScript-${dossier.topic?.substring(0, 30)}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('PDF export failed. Try again.');
    }
  };

  // ── Loading State ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-slate-400">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Agent is researching... this may take 15-30 seconds</p>
      </div>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-xl p-5 text-red-400 text-sm">
        ❌ {error}
      </div>
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────────
  if (!dossier) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-600 space-y-3">
        <span className="text-5xl">🏏</span>
        <p className="text-sm">Enter a topic and run the research agent to see your dossier here.</p>
      </div>
    );
  }

  const report = dossier.synthesizedReport;

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sky-400 text-2xl font-bold">{dossier.topic}</h2>
          <p className="text-slate-500 text-xs mt-1">
            Generated {new Date(dossier.generatedAt).toLocaleString('en-IN')}
            {dossier.estimatedWordCount && ` · ~${dossier.estimatedWordCount} words`}
          </p>
        </div>
        <button
          onClick={handlePDFDownload}
          className="shrink-0 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
        >
          ↓ Export PDF
        </button>
      </div>

      {/* ── Executive Summary ───────────────────────────────────────────── */}
      {report.executiveSummary && (
        <Section title="📋 Executive Summary">
          <p className="text-slate-300 text-sm leading-relaxed">{report.executiveSummary}</p>
        </Section>
      )}

      {/* ── Pre-Match Context ───────────────────────────────────────────── */}
      {report.preMatchContext?.length > 0 && (
        <Section title="🎯 Pre-Match Context">
          <div className="space-y-3">
            {report.preMatchContext.map((item, i) => (
              <div key={i} className="border-l-2 border-amber-500 pl-3">
                <p className="text-amber-400 text-xs font-bold uppercase tracking-wide">{item.angle}</p>
                <p className="text-slate-300 text-sm mt-0.5">{item.detail}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Key Chronology Timeline ─────────────────────────────────────── */}
      {report.keyChronology?.length > 0 && (
        <Section title="🕐 Key Chronology & Turning Points">
          <div className="relative pl-5 space-y-5">
            {/* Vertical timeline line */}
            <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-700" />

            {report.keyChronology.map((item, i) => (
              <div key={i} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-sky-500 ring-2 ring-slate-900" />
                <p className="text-sky-400 text-xs font-bold">{item.timestampOrDate}</p>
                <p className="text-slate-100 text-sm font-semibold mt-0.5">{item.eventDescription}</p>
                <p className="text-slate-400 text-xs mt-0.5 italic">↳ {item.significance}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Tactical Breakdown ──────────────────────────────────────────── */}
      {report.tacticalBreakdown?.length > 0 && (
        <Section title="⚙️ Tactical Breakdown">
          <div className="space-y-4">
            {report.tacticalBreakdown.map((item, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-sky-300 font-semibold text-sm">{item.subheading}</p>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">{item.analysis}</p>
                {item.supportingData && (
                  <p className="text-amber-400 text-xs mt-2 font-mono bg-slate-900 rounded px-2 py-1">
                    📊 {item.supportingData}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Verified Quotes ─────────────────────────────────────────────── */}
      {report.verifiedQuotes?.length > 0 && (
        <Section title="💬 Verified Quotes">
          <div className="space-y-4">
            {report.verifiedQuotes.map((q, i) => (
              <blockquote key={i} className="border-l-4 border-sky-500 pl-4">
                <p className="text-slate-100 text-sm italic">"{q.quote}"</p>
                <footer className="mt-2">
                  <span className="text-amber-400 font-bold text-xs">— {q.speaker}</span>
                  <span className="text-slate-500 text-xs ml-2">{q.context}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </Section>
      )}

      {/* ── Stat Highlights Table ───────────────────────────────────────── */}
      {report.statHighlights?.length > 0 && (
        <Section title="📊 Statistical Highlights">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 font-semibold py-2 pr-4">Metric</th>
                  <th className="text-left text-amber-400 font-semibold py-2 pr-4">Value</th>
                  <th className="text-left text-slate-400 font-semibold py-2">Context</th>
                </tr>
              </thead>
              <tbody>
                {report.statHighlights.map((s, i) => (
                  <tr key={i} className="border-b border-slate-800">
                    <td className="text-slate-300 py-2 pr-4">{s.metric}</td>
                    <td className="text-amber-300 font-bold py-2 pr-4 font-mono">{s.value}</td>
                    <td className="text-slate-400 py-2 text-xs">{s.historicalContext}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* ── Sources & Links ─────────────────────────────────────────────── */}
      {report.sources?.length > 0 && (
        <Section title="🔗 Sources">
          <div className="space-y-2">
            {report.sources.map((src, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-slate-600 text-xs mt-0.5 shrink-0">{i + 1}.</span>
                <div>
                  {src.imageUrl && (
                    <img src={src.imageUrl} alt={src.title} className="w-16 h-10 object-cover rounded mb-1 float-right ml-2 opacity-80" />
                  )}
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 text-sm underline underline-offset-2 line-clamp-2"
                  >
                    {src.title}
                  </a>
                  <p className="text-slate-600 text-xs truncate">{src.url}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

    </div>
  );
}

// ── Reusable section wrapper ───────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h3 className="text-slate-100 font-bold text-base mb-4">{title}</h3>
      {children}
    </div>
  );
}
