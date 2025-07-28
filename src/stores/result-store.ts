import { create } from "zustand";
import { Result } from "@/types/result";

type State = {
  results: Result[];
};

type Action = {
  setResults: (
    partyResult: Result[],
    candidateResult: Result[]
  ) => void;
  clearResults: () => void;
};

export const useResultStore = create<State & Action>((set) => ({
  results: [],
  setResults: (partyResults, candidateResults) =>
    set(() => ({
      results: [
        ...partyResults,
        ...candidateResults,
      ],
    })),
  clearResults: () => set({ results: [] }),
}));