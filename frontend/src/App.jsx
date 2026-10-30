import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import LandingView from './views/LandingView';
import EngineHubView from './views/EngineHubView';
import ResearchWorkspaceView from './views/ResearchWorkspaceView';
import ScriptWorkspaceView from './views/ScriptWorkspaceView';

export default function App() {
  // Navigation State: 'landing' | 'hub' | 'research' | 'script'
  const [currentView, setCurrentView] = useState('landing');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-app text-theme-primary selection:bg-emerald-500/20 selection:text-emerald-500 transition-colors">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <LandingView onContinue={() => setCurrentView('hub')} />
            </motion.div>
          )}

          {currentView === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <EngineHubView
                onBack={() => setCurrentView('landing')}
                onSelectEngine={(engineKey) => {
                  if (engineKey === 'research') {
                    setCurrentView('research');
                  } else if (engineKey === 'script') {
                    setCurrentView('script');
                  }
                }}
              />
            </motion.div>
          )}

          {currentView === 'research' && (
            <motion.div
              key="research"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <ResearchWorkspaceView onBack={() => setCurrentView('hub')} />
            </motion.div>
          )}

          {currentView === 'script' && (
            <motion.div
              key="script"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <ScriptWorkspaceView onBack={() => setCurrentView('hub')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
