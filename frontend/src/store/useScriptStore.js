import { create } from 'zustand';

const useScriptStore = create((set) => ({
  // The generated script project (null until generated)
  script: null,

  // Loading state while RAG & Gemini are working
  isLoading: false,

  // Error message if generation fails
  error: null,

  // Actions
  setScript: (script) => set({ script, error: null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ script: null, isLoading: false, error: null }),
}));

export default useScriptStore;
