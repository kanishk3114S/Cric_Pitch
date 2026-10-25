import { useState } from 'react';
import useResearchStore from '../store/useResearchStore';
import { ArrowLeft, FileText, Upload, Sparkles, Sliders, Film, Volume2, ShieldAlert } from 'lucide-react';

export default function ScriptWorkspaceView({ onBack }) {
  const { dossier } = useResearchStore();

  const [inputMode, setInputMode] = useState(dossier ? 'dossier' : 'custom');
  const [customBrief, setCustomBrief] = useState('');
  const [videoFormat, setVideoFormat] = useState('youtube_documentary');
  const [duration, setDuration] = useState(8);
  const [scriptType, setScriptType] = useState('dramatic_storytelling');
  const [pauseIntensity, setPauseIntensity] = useState('heavy_dramatic');

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-20 bg-[#030712]/90 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>HUB</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-sm font-extrabold tracking-wide text-white uppercase flex items-center gap-2">
              <span className="text-amber-400">ENGINE 02</span> / CADENCE-RAG & STORYBOARD STUDIO
            </span>
          </div>

          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
            Milestone 2 • Cadence Vault
          </span>
        </div>
      </header>

      {/* ── Main Studio Grid ── */}
      <main className="max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-8 flex-1 items-start">
        
        {/* ── LEFT: PRODUCTION CONTROLS ── */}
        <aside className="space-y-6">
          <div className="cricket-card rounded-2xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h2 className="text-sm font-extrabold tracking-wider uppercase text-amber-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Video Production Settings
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Cadence RAG</span>
            </div>

            {/* Research Source Toggle */}
            <div>
              <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                Research Input Source
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-white/5 text-xs">
                <button
                  type="button"
                  onClick={() => setInputMode('dossier')}
                  disabled={!dossier}
                  className={`py-2 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                    inputMode === 'dossier'
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
                  }`}
                >
                  Use Engine 1 Dossier {dossier ? '✓' : '(Empty)'}
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('custom')}
                  className={`py-2 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                    inputMode === 'custom'
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload Own Brief
                </button>
              </div>
            </div>

            {/* If Custom brief */}
            {inputMode === 'custom' && (
              <div>
                <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                  Paste Custom Match Research or Notes
                </label>
                <textarea
                  value={customBrief}
                  onChange={(e) => setCustomBrief(e.target.value)}
                  rows={4}
                  placeholder="Paste your own researched facts, scorecard notes, or match chronology here..."
                  className="w-full bg-slate-900/90 text-white border border-slate-700 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500 placeholder-slate-500 resize-none"
                />
              </div>
            )}

            {/* Video Format Selector */}
            <div>
              <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                Target Video Format
              </label>
              <select
                value={videoFormat}
                onChange={(e) => setVideoFormat(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="youtube_documentary">YouTube Documentary (8-15 min, 4-act arc)</option>
                <option value="youtube_short_or_reel">YouTube Short / Reel (45-60 sec, instant hook)</option>
                <option value="tactical_analysis">Tactical Analysis (5-8 min, ball-by-ball)</option>
                <option value="player_biopic_tribute">Player Biopic Tribute (6-10 min, emotional)</option>
              </select>
            </div>

            {/* Target Duration */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-bold uppercase tracking-wider">Target Duration</span>
                <span className="text-amber-400 font-mono font-bold">{duration} Minutes (~{duration * 130} words)</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Pause & Cadence Profile */}
            <div>
              <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                Acoustic Pause Intensity
              </label>
              <select
                value={pauseIntensity}
                onChange={(e) => setPauseIntensity(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="heavy_dramatic">Heavy Dramatic (Frequent [pause] tags & staccato beats)</option>
                <option value="moderate">Moderate Broadcast (Standard documentary voiceover)</option>
                <option value="subtle">Subtle / Rapid Flow (Fast conversational narrative)</option>
              </select>
            </div>

            {/* Generate Script Button */}
            <button
              onClick={() =>
                alert(
                  'Engine 2 Pipeline: Ingesting your 100-120 past reference scripts into Pinecone Serverless is scheduled for Milestone 3! Engine 1 (Research Agent) is currently live and generating research.'
                )
              }
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>GENERATE CADENCE SCRIPT & STORYBOARD</span>
            </button>

          </div>
        </aside>

        {/* ── RIGHT: STORYBOARD & SCRIPT TELEPROMPTER PREVIEW ── */}
        <section className="space-y-6">
          <div className="relative rounded-2xl p-8 border border-white/10 space-y-5 bg-[#090d16] overflow-hidden shadow-2xl">
            
            {/* Dramatic Stadium / Intense Match Backdrop with Directional Matte Mask */}
            <div className="absolute top-0 right-0 w-2/3 h-80 pointer-events-none overflow-hidden">
              <img
                src="/images/cricket/stadium-modi.jpg"
                alt="Broadcast Lighting"
                className="w-full h-full object-cover object-[50%_20%] opacity-20 contrast-125 saturate-75"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, #090d16 15%, rgba(9,13,22,0.85) 60%, rgba(9,13,22,0.3) 100%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-amber-400 text-[11px] font-mono uppercase tracking-wider font-semibold">
                  Teleprompter & FLUX.1 Storyboard Canvas
                </span>
                <h3 className="text-2xl font-cricket-title tracking-wide text-white uppercase mt-0.5">
                  Acoustic Cadence Voiceover Preview
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-400">
                2-Column Storyboard PDF Ready
              </span>
            </div>

            {/* Teleprompter Sample Demonstration */}
            <div className="relative z-10 bg-slate-950/80 rounded-2xl p-6 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>SCENE 01 • COLD OPEN HOOK</span>
                <span className="text-amber-400">Pacing: 130 WPM • Whisper Delivery</span>
              </div>

              {/* Voiceover line with highlighted [pause] tag */}
              <div className="font-mono text-sm sm:text-base leading-relaxed text-slate-200 bg-black/60 p-5 rounded-xl border border-white/5">
                <p>Lord's Cricket Ground.</p>
                <p>July 14, 2019.</p>
                <p>Twenty-four thousand people inside the stadium...</p>
                <p>and not a single person breathing.</p>
                <p className="my-2.5">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded text-xs font-bold">
                    [pause — hold silence for 1.8s]
                  </span>
                </p>
                <p>Three balls remaining.</p>
                <p>Eight runs needed.</p>
                <p>This wasn't cricket anymore.</p>
                <p>It was psychological war.</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 flex items-start gap-4 text-xs">
                <Film className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-200">Visual Cue & FLUX.1 Prompt:</p>
                  <p className="text-slate-400 mt-0.5">
                    "Cinematic 35mm low-angle shot of Lord's pavilion under heavy London overcast sky, crowd blurred in shallow depth of field, focus on bowler's bowling crease."
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200 leading-relaxed">
              💡 <strong>Architecture Note:</strong> In Engine 2, the style chunker segments your past reference scripts, generates 768-dim embeddings via Ollama or Gemini, and indexes them in Pinecone. The cloud LLM then separates the <em>"What"</em> (facts from Engine 1 or your own PDF) from the <em>"How"</em> (your sentence rhythms and pause tags).
            </div>

          </div>
        </section>

      </main>

    </div>
  );
}
