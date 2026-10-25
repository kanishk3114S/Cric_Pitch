import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PHILOSOPHY_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4';

export default function PhilosophySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="philosophy" className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
        >
          Investigation{' '}
          <span className="font-serif italic text-white/40">x</span>{' '}
          Cadence
        </motion.h2>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left Video */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="rounded-3xl overflow-hidden aspect-[4/3] border border-white/10 shadow-2xl relative"
          >
            <video
              src={PHILOSOPHY_VIDEO_URL}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </motion.div>

          {/* Right Text Blocks */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Block 1 */}
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase font-semibold mb-4">
                Ground-Truth Fact Synthesis
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Every meaningful cricket documentary begins at the intersection of unassailable statistical truth
                and breathless acoustic cadence. We operate at that exact crossroads, turning dry scorecards into
                palpable human drama.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10" />

            {/* Block 2 */}
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase font-semibold mb-4">
                Shape the Narrative
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                We believe that legendary scripts emerge when tactical facts meet directorial precision.
                Our research agent unearths the overlooked turning points — the pitch deterioration,
                the bowler's pre-series fatigue, the obscure laws, and the authentic press conference admissions.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
