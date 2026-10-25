// src/store/useResearchStore.js
// Zustand store — our global in-memory state.
// Think of this as React's useState but shared across ALL components.
// No database, no localStorage — pure ephemeral RAM state.

import { create } from 'zustand';

const useResearchStore = create((set) => ({
  // ── State ───────────────────────────────────────────────────────────────

  // The compiled research dossier returned from the agent (null until generated)
  dossier: null,

  // Loading state while the agent is running
  isLoading: false,

  // Any error message to show to the user
  error: null,

  // ── Actions ─────────────────────────────────────────────────────────────

  // Save the dossier when the agent returns it
  setDossier: (dossier) => set({ dossier, error: null }),

  // Track loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Save error messages
  setError: (error) => set({ error, isLoading: false }),

  // Clear everything (start fresh)
  reset: () => set({ dossier: null, isLoading: false, error: null }),
}));

export default useResearchStore;
