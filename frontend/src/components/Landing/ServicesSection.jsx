import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CARD1_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';
const CARD2_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4';

export default function ServicesSection({ onSelectEngine }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="engines" className="relative bg-theme-app py-28 md:py-40 px-6 overflow-hidden transition-colors">
      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl text-theme-primary tracking-tight font-display">
            What We Do
          </h2>
          <span className="text-theme-muted text-sm hidden md:inline-block uppercase tracking-widest font-semibold">
            Our Two Dedicated Engines
          </span>
        </motion.div>

        {/* Two-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Card 1: Engine 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            onClick={() => onSelectEngine?.('research')}
            className="rounded-3xl overflow-hidden group cursor-pointer border border-theme-subtle bg-theme-card shadow-theme-card"
          >
            {/* Video Area */}
            <div className="aspect-video relative overflow-hidden">
              <video
                src={CARD1_VIDEO_URL}
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Card Body */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="uppercase tracking-widest text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  ENGINE 1 • ACTIVE NOW
                </span>
                <div className="rounded-full p-2 bg-theme-elevated group-hover:bg-theme-hover transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-theme-primary" />
                </div>
              </div>
              <h3 className="text-theme-primary text-xl md:text-2xl mb-3 tracking-tight font-medium">
                Deep Cricket Research Agent
              </h3>
              <p className="text-theme-muted text-sm leading-relaxed">
                We dig deep into official match scorecards, pitch reports, and press conference transcripts to surface
                verified match facts, turning points, and tactical anomalies under strict zero-hallucination grounding.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Engine 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            onClick={() => onSelectEngine?.('script')}
            className="rounded-3xl overflow-hidden group cursor-pointer border border-theme-subtle bg-theme-card shadow-theme-card"
          >
            {/* Video Area */}
            <div className="aspect-video relative overflow-hidden">
              <video
                src={CARD2_VIDEO_URL}
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Card Body */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="uppercase tracking-widest text-amber-500 text-xs font-semibold">
                  ENGINE 2 • ACTIVE NOW
                </span>
                <div className="rounded-full p-2 bg-theme-elevated group-hover:bg-theme-hover transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-theme-primary" />
                </div>
              </div>
              <h3 className="text-theme-primary text-xl md:text-2xl mb-3 tracking-tight font-medium">
                Personal Voiceover Studio
              </h3>
              <p className="text-theme-muted text-sm leading-relaxed">
                Writes with high-retention video-essay cadence, breathless dramatic pauses, and authentic Hinglish storytelling
                to synthesize complete 3-part teleprompter scripts with dramatic [pause] cues and camera direction.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
