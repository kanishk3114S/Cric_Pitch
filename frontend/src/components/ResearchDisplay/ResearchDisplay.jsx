// src/components/ResearchDisplay/ResearchDisplay.jsx
import useResearchStore from '../../store/useResearchStore';
import { exportToPDF } from '../../services/api';
import { Download, ExternalLink, Clock, ShieldCheck, Quote, BarChart2, Activity } from 'lucide-react';

export default function ResearchDisplay() {
  const { dossier, error, isLoading } = useResearchStore();

  const handlePDFDownload = async () => {
    try {
      const response = await exportToPDF(dossier);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `CricScript-${dossier.topic?.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('PDF export failed. Try again.');
    }
  };

  // ── Loading State ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-3xl p-12 border border-theme-subtle bg-theme-card shadow-theme-card flex flex-col items-center justify-center min-h-[460px] text-center space-y-5 transition-colors">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-theme-subtle border-t-emerald-500 rounded-full animate-spin" />
          <Activity className="w-6 h-6 text-emerald-500 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-serif text-theme-primary tracking-tight">Investigating the Archives</h3>
          <p className="text-theme-muted text-xs mt-2 max-w-sm leading-relaxed">
            Multi-hop search executing across match scorecards, pitch reports, and press conferences.
            Synthesizing factual chronology...
          </p>
        </div>
      </div>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="rounded-3xl p-8 border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300 text-sm">
        <p className="font-semibold uppercase tracking-wider text-xs mb-1">Execution Interrupted</p>
        <p>{error}</p>
      </div>
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────────
  if (!dossier) {
    return (
      <div className="rounded-3xl p-12 border border-theme-subtle bg-theme-card shadow-theme-card flex flex-col items-center justify-center min-h-[460px] text-center space-y-4 transition-colors">
        <div className="w-16 h-16 rounded-full bg-theme-elevated border border-theme-subtle flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-theme-muted" />
        </div>
        <div>
          <h3 className="text-2xl font-serif text-theme-primary tracking-tight">Investigative Match Intelligence</h3>
          <p className="text-theme-muted text-sm mt-2 max-w-md leading-relaxed">
            Configure your topic and directorial brief on the left. The agent will compile verified match chronology,
            tactical points, verified quotes, and statistical anomalies here.
          </p>
        </div>
      </div>
    );
  }

  const report = dossier.synthesizedReport || {};

  return (
    <div className="space-y-6 transition-colors">

      {/* ── Header Card ─────────────────────────────────────────────────── */}
      <div className="rounded-3xl p-6 md:p-8 border border-theme-subtle bg-theme-card shadow-theme-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-emerald-600 dark:text-emerald-400 text-xs tracking-widest uppercase font-semibold">
            Synthesized Research Dossier
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-theme-primary tracking-tight mt-1">
            {dossier.topic}
          </h2>
          <p className="text-theme-muted text-xs mt-2 flex items-center gap-3 font-mono">
            <span>{new Date(dossier.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span>~{dossier.estimatedWordCount || '450'} words</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Ground-Truth Verified</span>
          </p>
        </div>

        <button
          onClick={handlePDFDownload}
          className="rounded-full px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-black" />
          Export PDF
        </button>
      </div>

      {/* ── Executive Summary ───────────────────────────────────────────── */}
      {report.executiveSummary && (
        <GlassSection title="Executive Summary" icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}>
          <p className="text-theme-secondary text-sm md:text-base leading-relaxed">
            {report.executiveSummary}
          </p>
        </GlassSection>
      )}

      {/* ── Pre-Match Context ───────────────────────────────────────────── */}
      {report.preMatchContext?.length > 0 && (
        <GlassSection title="Pre-Match Atmosphere & Context">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.preMatchContext.map((item, i) => (
              <div key={i} className="bg-theme-elevated border border-theme-subtle rounded-2xl p-4">
                <p className="text-amber-500 text-[11px] font-semibold uppercase tracking-wider mb-1">
                  {item.angle}
                </p>
                <p className="text-theme-secondary text-xs leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </GlassSection>
      )}

      {/* ── Key Chronology Timeline ─────────────────────────────────────── */}
      {report.keyChronology?.length > 0 && (
        <GlassSection title="Chronology & Turning Points" icon={<Clock className="w-4 h-4 text-emerald-500" />}>
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500 via-emerald-500/20 to-transparent" />

            {report.keyChronology.map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-theme-card" />
                <span className="text-amber-500 font-mono text-xs font-semibold uppercase tracking-wider">
                  {item.timestampOrDate}
                </span>
                <p className="text-theme-primary text-sm font-medium mt-1 leading-snug">
                  {item.eventDescription}
                </p>
                <p className="text-theme-muted text-xs mt-1 leading-relaxed italic">
                  ↳ {item.significance}
                </p>
              </div>
            ))}
          </div>
        </GlassSection>
      )}

      {/* ── Tactical Breakdown ──────────────────────────────────────────── */}
      {report.tacticalBreakdown?.length > 0 && (
        <GlassSection title="Tactical & Analytical Breakdown">
          <div className="space-y-4">
            {report.tacticalBreakdown.map((item, i) => (
              <div key={i} className="bg-theme-elevated border border-theme-subtle rounded-2xl p-5">
                <h4 className="text-theme-primary text-sm font-semibold tracking-wide mb-2">
                  {item.subheading}
                </h4>
                <p className="text-theme-secondary text-xs md:text-sm leading-relaxed">
                  {item.analysis}
                </p>
                {item.supportingData && (
                  <div className="mt-3 inline-block bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    📊 {item.supportingData}
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassSection>
      )}

      {/* ── Verified Quotes ─────────────────────────────────────────────── */}
      {report.verifiedQuotes?.length > 0 && (
        <GlassSection title="Verified Player & Umpire Quotes" icon={<Quote className="w-4 h-4 text-amber-500" />}>
          <div className="space-y-4">
            {report.verifiedQuotes.map((q, i) => (
              <blockquote key={i} className="bg-theme-elevated border-l-4 border-amber-500 rounded-r-2xl p-5 relative overflow-hidden">
                <p className="text-theme-primary text-sm md:text-base font-serif italic leading-relaxed">
                  "{q.quote}"
                </p>
                <footer className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-amber-500 font-bold">— {q.speaker}</span>
                  <span className="text-theme-muted text-[11px]">{q.context}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </GlassSection>
      )}

      {/* ── Stat Highlights ─────────────────────────────────────────────── */}
      {report.statHighlights?.length > 0 && (
        <GlassSection title="Statistical Anomalies" icon={<BarChart2 className="w-4 h-4 text-emerald-500" />}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-theme-subtle text-theme-muted uppercase tracking-widest text-[10px]">
                  <th className="py-2.5 pr-4 font-semibold">Metric</th>
                  <th className="py-2.5 pr-4 font-semibold text-emerald-600 dark:text-emerald-400">Value</th>
                  <th className="py-2.5 font-semibold">Historical Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {report.statHighlights.map((s, i) => (
                  <tr key={i} className="hover:bg-theme-elevated/40 transition-colors">
                    <td className="py-3 pr-4 text-theme-primary font-medium">{s.metric}</td>
                    <td className="py-3 pr-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">{s.value}</td>
                    <td className="py-3 text-theme-muted leading-relaxed">{s.historicalContext}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassSection>
      )}

      {/* ── Sources ─────────────────────────────────────────────────────── */}
      {report.sources?.length > 0 && (
        <GlassSection title="Ground-Truth References & News Sources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-theme-elevated hover:bg-theme-hover border border-theme-subtle rounded-2xl p-4 flex items-start justify-between gap-3 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-theme-primary text-xs font-medium line-clamp-1 group-hover:text-emerald-500 transition-colors">
                    {src.title}
                  </p>
                  <p className="text-theme-muted text-[11px] font-mono truncate mt-0.5">
                    {src.url}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-theme-muted group-hover:text-emerald-500 shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        </GlassSection>
      )}

    </div>
  );
}

// ── Reusable Section Card ──────────────────────────────────────
function GlassSection({ title, icon, children }) {
  return (
    <div className="rounded-3xl p-6 md:p-8 border border-theme-subtle bg-theme-card shadow-theme-card space-y-4 transition-colors">
      <div className="flex items-center gap-2 pb-3 border-b border-theme-subtle">
        {icon}
        <h3 className="text-lg font-serif text-theme-primary tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}
