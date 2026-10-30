import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      id="about"
      className="relative bg-theme-app pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden transition-colors"
    >
      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-theme-muted text-sm tracking-widest uppercase font-semibold mb-6"
        >
          The Directorial Standard
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-theme-primary leading-[1.15] tracking-tight font-display"
        >
          Pioneering the narrative{' '}
          <span className="font-serif italic text-theme-secondary">for</span>
          <br className="hidden md:inline" />{' '}
          <span className="font-serif italic text-theme-secondary">
            minds that then direct, captivate, and immortalize.
          </span>
        </motion.h2>

      </div>
    </section>
  );
}
