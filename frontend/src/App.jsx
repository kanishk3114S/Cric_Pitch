import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import LandingView from './views/LandingView';
import EngineHubView from './views/EngineHubView';
import ResearchWorkspaceView from './views/ResearchWorkspaceView';
import ScriptWorkspaceView from './views/ScriptWorkspaceView';
import PrivacyPolicyView from './views/PrivacyPolicyView';
import TermsView from './views/TermsView';
import NotFoundView from './views/NotFoundView';

function getViewFromPath(pathname) {
  const path = typeof window !== 'undefined' ? (pathname || window.location.pathname || '/') : '/';
  const clean = path.toLowerCase().replace(/\/$/, '') || '/';
  
  if (clean === '/' || clean === '/home') return 'landing';
  if (clean === '/hub') return 'hub';
  if (clean === '/research') return 'research';
  if (clean === '/script') return 'script';
  if (clean === '/privacy') return 'privacy';
  if (clean === '/terms') return 'terms';
  return '404';
}

function getPathFromView(view) {
  switch (view) {
    case 'landing': return '/';
    case 'hub': return '/hub';
    case 'research': return '/research';
    case 'script': return '/script';
    case 'privacy': return '/privacy';
    case 'terms': return '/terms';
    default: return '/';
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState(() => getViewFromPath());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view) => {
    const targetPath = getPathFromView(view);
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-app text-theme-primary selection:bg-[#D91F2B]/20 selection:text-white transition-colors">
        <AnimatePresence mode="wait" initial={false}>
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <LandingView
                onContinue={() => navigateTo('hub')}
                onNavigateLegal={(view) => navigateTo(view)}
              />
            </motion.div>
          )}

          {currentView === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <EngineHubView
                onBack={() => navigateTo('landing')}
                onSelectEngine={(engineKey) => {
                  if (engineKey === 'research') {
                    navigateTo('research');
                  } else if (engineKey === 'script') {
                    navigateTo('script');
                  }
                }}
                onNavigateLegal={(view) => navigateTo(view)}
              />
            </motion.div>
          )}

          {currentView === 'research' && (
            <motion.div
              key="research"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ResearchWorkspaceView
                onBack={() => navigateTo('hub')}
                onNavigateLegal={(view) => navigateTo(view)}
              />
            </motion.div>
          )}

          {currentView === 'script' && (
            <motion.div
              key="script"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ScriptWorkspaceView
                onBack={() => navigateTo('hub')}
                onNavigateLegal={(view) => navigateTo(view)}
              />
            </motion.div>
          )}

          {currentView === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <PrivacyPolicyView onBack={() => navigateTo('landing')} />
            </motion.div>
          )}

          {currentView === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <TermsView onBack={() => navigateTo('landing')} />
            </motion.div>
          )}

          {currentView === '404' && (
            <motion.div
              key="404"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <NotFoundView onGoHome={() => navigateTo('landing')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
