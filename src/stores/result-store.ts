import { create } from "zustand";
import { Results } from "@/types/result";

type State = {
  results: Results;
};

type Action = {
  setResults: (results: Results) => void;
  clearResults: () => void;
};

export const useResultStore = create<State & Action>((set) => ({
  results: {
    partyResults: [],
    candidateResults: [],
  },
  setResults: (results) => set(() => ({ results })),
  clearResults: () =>
    set({ results: { partyResults: [], candidateResults: [] } }),
}));
