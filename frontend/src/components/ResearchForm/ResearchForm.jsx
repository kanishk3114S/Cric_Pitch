// src/components/ResearchForm/ResearchForm.jsx
import { useState, useEffect } from 'react';
import useResearchStore from '../../store/useResearchStore';
import { generateResearch } from '../../services/api';
import { Sparkles, Sliders, Image as ImageIcon, Flame } from 'lucide-react';

export default function ResearchForm({ externalTopic = '' }) {
  const { setDossier, setLoading, setError, isLoading } = useResearchStore();

  const [topic, setTopic] = useState('');
  const [preContextText, setPreContextText] = useState('');
  const [researchLength, setResearchLength] = useState(500);
  const [includeMedia, setIncludeMedia] = useState(false);

  // Sync if topic passed from Hero
  useEffect(() => {
    if (externalTopic) {
      setTopic(externalTopic);
    }
  }, [externalTopic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const preContext = preContextText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 5);

    setLoading(true);

    try {
      const { data } = await generateResearch({
        topic: topic.trim(),
        preContext,
        researchLength,
        includeMedia,
      });

      setDossier(data.data.dossier);
    } catch (err) {
      setError(err.response?.data?.error || 'Research failed to complete. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl p-6 md:p-8 border border-theme-subtle bg-theme-card shadow-theme-card space-y-6 transition-colors">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-theme-subtle">
        <div>
          <span className="text-emerald-600 dark:text-emerald-400 text-xs tracking-widest uppercase font-semibold">
            Cockpit • Engine 1
          </span>
          <h2 className="text-2xl font-serif text-theme-primary tracking-tight mt-1">
            Research Directorial Brief
          </h2>
        </div>
        <div className="rounded-full px-3 py-1 text-xs text-theme-secondary flex items-center gap-1.5 border border-theme-subtle bg-theme-elevated">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Stateless
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Topic Input */}
        <div>
          <label className="block text-theme-secondary text-xs font-semibold uppercase tracking-wider mb-2">
            Match or Turning Point
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 2019 World Cup Final: Stokes Overthrow Incident"
            className="w-full bg-theme-input text-theme-primary border border-theme-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 placeholder:text-theme-dim transition-colors"
            required
          />
        </div>

        {/* Focus Points (Pre-Context) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-theme-secondary text-xs font-semibold uppercase tracking-wider">
              Directorial Angles & Focus Points
            </label>
            <span className="text-theme-muted text-xs">1 per line, max 5</span>
          </div>
          <textarea
            value={preContextText}
            onChange={(e) => setPreContextText(e.target.value)}
            rows={4}
            placeholder={`Stokes dive physics and bat deflection\nSimon Taufel MCC Law 19.8 controversy\nPitch conditions at Lord's that cloudy afternoon\nMartin Guptill body language from deep mid-wicket`}
            className="w-full bg-theme-input text-theme-primary border border-theme-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 placeholder:text-theme-dim resize-none transition-colors"
          />
        </div>

        {/* Word Count Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-theme-secondary font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-500" />
              Depth Target
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {researchLength} words
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={researchLength}
            onChange={(e) => setResearchLength(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-theme-elevated rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-theme-muted">
            <span>100 (Tight)</span>
            <span>500 (Standard)</span>
            <span>1000 (Exhaustive)</span>
          </div>
        </div>

        {/* Include Media Toggle */}
        <div className="flex items-center justify-between bg-theme-elevated border border-theme-subtle rounded-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-theme-app flex items-center justify-center border border-theme-subtle">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-theme-primary text-xs font-semibold uppercase tracking-wide">
                Include Press Photos & Links
              </p>
              <p className="text-theme-muted text-[11px]">
                Fetches verified media thumbnails with articles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIncludeMedia(!includeMedia)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 relative cursor-pointer border border-theme-subtle ${
              includeMedia ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-transform duration-200 ${
                includeMedia ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'
              }`}
            />
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-emerald-glow disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3.5 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing Match Data...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Launch Research Investigation</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
