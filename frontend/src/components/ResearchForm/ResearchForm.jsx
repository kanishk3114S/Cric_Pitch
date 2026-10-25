// src/components/ResearchForm/ResearchForm.jsx
// The input form. Collects: topic, preContext, researchLength, includeMedia.
// Calls the backend API and saves the result in Zustand store.

import { useState } from 'react';
import useResearchStore from '../../store/useResearchStore';
import { generateResearch } from '../../services/api';

export default function ResearchForm() {
  const { setDossier, setLoading, setError, isLoading } = useResearchStore();

  // Local form state
  const [topic, setTopic] = useState('');
  const [preContextText, setPreContextText] = useState('');  // raw textarea text
  const [researchLength, setResearchLength] = useState(500);
  const [includeMedia, setIncludeMedia] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic.trim()) return;

    // Convert textarea into an array of focus points (one per line, filter empties)
    const preContext = preContextText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 5); // Max 5 focus points

    setLoading(true);

    try {
      const { data } = await generateResearch({
        topic,
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
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-5">
      <h2 className="text-sky-400 text-xl font-bold tracking-wide">🔎 Research Agent</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Topic Input */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-1">
            Cricket Topic / Match
          </label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. 2019 World Cup Final Overthrow Incident"
            className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 placeholder-slate-500"
            required
          />
        </div>

        {/* Pre-Context (User Focus Points) */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-1">
            Your Focus Points
            <span className="text-slate-500 font-normal ml-2">(1 per line, max 5)</span>
          </label>
          <textarea
            value={preContextText}
            onChange={e => setPreContextText(e.target.value)}
            rows={4}
            placeholder={`Focus on Kohli's form before the series\nPitch conditions at Lord's that day\nThe psychological battle between captains\nMCC Law 19.8 controversy explained`}
            className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 placeholder-slate-500 resize-none"
          />
        </div>

        {/* Research Length Slider */}
        <div>
          <label className="block text-slate-300 text-sm font-semibold mb-1">
            Research Depth
            <span className="text-sky-400 font-bold ml-2">{researchLength} words</span>
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={researchLength}
            onChange={e => setResearchLength(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-slate-500 text-xs mt-1">
            <span>100 (Quick)</span>
            <span>500 (Standard)</span>
            <span>1000 (Deep)</span>
          </div>
        </div>

        {/* Include Media Toggle */}
        <div className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3">
          <div>
            <p className="text-slate-200 text-sm font-semibold">Include Images & Links</p>
            <p className="text-slate-500 text-xs">Fetches news images alongside sources (uses extra tokens)</p>
          </div>
          <button
            type="button"
            onClick={() => setIncludeMedia(!includeMedia)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
              includeMedia ? 'bg-sky-500' : 'bg-slate-600'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                includeMedia ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm transition-colors duration-200"
        >
          {isLoading ? '🔄 Agent is researching...' : '🏏 Run Research Agent'}
        </button>

      </form>
    </div>
  );
}
