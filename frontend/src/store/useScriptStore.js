import { create } from 'zustand';

const useScriptStore = create((set) => ({
  // The generated script project (null until generated)
  script: null,

  // Loading state while writing voice & teleprompter copy are generating
  isLoading: false,

  // Error message if generation fails
  error: null,

  // Actions
  setScript: (script) => set((state) => ({ script, error: null, isLoading: script ? false : state.isLoading })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ script: null, isLoading: false, error: null }),
}));

export default useScriptStore;
