import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import Navbar from './Navbar';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';

// Crisp SVGs for social pills
const XTwitterIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function HeroSection({ onSearchTopic, onLaunchStudio }) {
  const videoRef = useRef(null);
  const [inputVal, setInputVal] = useState('');
  const fadingOutRef = useRef(false);

  // ── Vanilla JS Video Crossfade Loop (No CSS transitions) ──────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animFrameId = null;

    const animateOpacity = (from, to, duration, onComplete) => {
      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentOpacity = from + (to - from) * progress;
        video.style.opacity = currentOpacity.toString();

        if (progress < 1) {
          animFrameId = requestAnimationFrame(step);
        } else if (onComplete) {
          onComplete();
        }
      };
      animFrameId = requestAnimationFrame(step);
    };

    const handleCanPlay = () => {
      video.play().catch(() => {});
      animateOpacity(0, 1, 500);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        const current = parseFloat(video.style.opacity || '1');
        animateOpacity(current, 0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        fadingOutRef.current = false;
        video.play().catch(() => {});
        animateOpacity(0, 1, 500);
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearchTopic(inputVal.trim());
    } else {
      onLaunchStudio();
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col bg-black">
      {/* Background Video with Vanilla JS Opacity Ref */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        autoPlay
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none z-1" />

      {/* Navbar */}
      <Navbar onLaunchStudio={onLaunchStudio} />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[10%] md:-translate-y-[15%]">
        
        {/* Massive Serif Heading */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight font-serif select-none">
          Know the pitch then <em className="italic text-white/70">all</em>.
        </h1>

        {/* Liquid Glass Input Pill */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-xl w-full">
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter a cricket topic (e.g. 2019 WC Final Overthrow)..."
              className="w-full bg-transparent text-white placeholder:text-white/40 text-sm md:text-base focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white rounded-full p-3 text-black hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
              title="Launch Research"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Subtitle */}
        <p className="mt-6 text-white/80 text-sm md:text-base max-w-lg leading-relaxed px-4">
          Documentary-grade investigative intelligence & personal cadence scriptwriting.
          Ground your storytelling in verified match stats, obscure laws, and raw quotes.
        </p>

        {/* Manifesto Button */}
        <div className="mt-6">
          <button
            onClick={onLaunchStudio}
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
          >
            Open Research Studio
          </button>
        </div>

      </div>

      {/* Social Icons Footer */}
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <XTwitterIcon />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <InstagramIcon />
        </a>
        <a
          href="https://espncricinfo.com"
          target="_blank"
          rel="noreferrer"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <Globe className="w-5 h-5" />
        </a>
      </div>

    </section>
  );
}
