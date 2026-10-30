import { motion } from 'framer-motion';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import { ThemeToggle } from '../context/ThemeContext';
import Button from '../components/ui/Button';

export default function NotFoundView({ onGoHome }) {
  return (
    <div className="relative min-h-screen bg-theme-app text-theme-primary flex flex-col justify-between p-6 md:p-12 overflow-hidden transition-colors">
      
      {/* ── Background: Subdued 4K Stadium Backdrop ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <picture className="w-full h-full">
          <source srcSet="/images/cricket/stadium-floodlights-4k.webp" type="image/webp" />
          <img
            src="/images/cricket/stadium-floodlights-4k.jpg"
            alt="4K Cricket Stadium Floodlights"
            className="w-full h-full object-cover object-center opacity-10 dark:opacity-20 contrast-125 saturate-50"
          />
        </picture>
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--radial-vignette)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, var(--bg-app) 20%, transparent 80%)',
          }}
        />
      </div>

      {/* ── Top Bar ── */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between pb-8 border-b border-theme-subtle">
        <Button
          variant="secondary"
          size="sm"
          onClick={onGoHome}
          icon={ArrowLeft}
          className="text-xs uppercase font-mono tracking-wider"
        >
          Back to Home
        </Button>
        <ThemeToggle />
      </div>

      {/* ── Main Error Block ── */}
      <main className="relative z-10 max-w-2xl mx-auto w-full text-center my-auto py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-elevated border border-[#D91F2B]/30 text-xs font-mono font-bold tracking-wider uppercase text-white shadow-md">
            <Compass className="w-4 h-4 text-[#D91F2B]" />
            <span>404 • OUTSIDE OFF-STUMP</span>
          </div>

          {/* Big Number */}
          <h1 className="text-7xl sm:text-9xl font-cricket-title tracking-wider text-[#D91F2B] leading-none">
            404
          </h1>

          <h2 className="text-2xl sm:text-3xl font-cricket-title tracking-wide text-theme-primary uppercase">
            PITCH NOT FOUND
          </h2>

          <p className="text-theme-secondary text-sm max-w-md mx-auto leading-relaxed">
            Looks like this delivery spun sharply past the outside edge and beat the keeper. The page you are looking for has moved or does not exist.
          </p>

          <div className="pt-4 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              icon={Home}
              onClick={onGoHome}
              className="text-xs tracking-wider uppercase font-bold shadow-lg shadow-[#D91F2B]/30"
            >
              RETURN TO HOME PITCH
            </Button>
          </div>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <div className="relative z-10 max-w-5xl mx-auto w-full pt-8 border-t border-theme-subtle flex items-center justify-between text-xs text-theme-muted font-mono">
        <span>CRICSCRIPT AI • HIGH RETENTION CRICKET STUDIO</span>
        <span>ERROR CODE: 404_PAGE_NOT_FOUND</span>
      </div>

    </div>
  );
}
