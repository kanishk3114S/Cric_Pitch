// src/components/ResearchForm/ResearchForm.jsx
// Upgraded to ultra-luxurious Liquid Glass cricket studio aesthetic.

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
      setError(err.response?.data?.error || 'Research failed. Check your API keys and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="liquid-glass rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-white/40 text-xs tracking-widest uppercase font-semibold">
            Cockpit • Engine 1
          </span>
          <h2 className="text-2xl font-serif text-white tracking-tight mt-1">
            Research Directorial Brief
          </h2>
        </div>
        <div className="liquid-glass rounded-full px-3 py-1 text-xs text-white/70 flex items-center gap-1.5 border border-white/10">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          Stateless
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Topic Input */}
        <div>
          <label className="block text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
            Match or Turning Point
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 2019 World Cup Final: Stokes Overthrow Incident"
            className="w-full bg-white/[0.04] text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 placeholder:text-white/30 transition-colors"
            required
          />
        </div>

        {/* Focus Points (Pre-Context) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-white/80 text-xs font-semibold uppercase tracking-wider">
              Directorial Angles & Focus Points
            </label>
            <span className="text-white/40 text-xs">1 per line, max 5</span>
          </div>
          <textarea
            value={preContextText}
            onChange={(e) => setPreContextText(e.target.value)}
            rows={4}
            placeholder={`Stokes dive physics and bat deflection\nSimon Taufel MCC Law 19.8 controversy\nPitch conditions at Lord's that cloudy afternoon\nMartin Guptill body language from deep mid-wicket`}
            className="w-full bg-white/[0.04] text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 placeholder:text-white/30 resize-none transition-colors"
          />
        </div>

        {/* Word Count Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/80 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-white/60" />
              Depth Target
            </span>
            <span className="text-white font-mono bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
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
            className="w-full accent-white cursor-pointer h-1.5 bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-white/40">
            <span>100 (Tight)</span>
            <span>500 (Standard)</span>
            <span>1000 (Exhaustive)</span>
          </div>
        </div>

        {/* Include Media Toggle */}
        <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <ImageIcon className="w-4 h-4 text-white/70" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wide">
                Include Press Photos & Links
              </p>
              <p className="text-white/40 text-[11px]">
                Fetches verified media thumbnails with articles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIncludeMedia(!includeMedia)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 relative cursor-pointer border border-white/10 ${
              includeMedia ? 'bg-white' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-transform duration-200 ${
                includeMedia ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white/60'
              }`}
            />
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white hover:bg-white/90 disabled:bg-white/20 disabled:cursor-not-allowed text-black font-semibold py-3.5 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing Match Data...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black" />
              <span>Launch Research Agent</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
