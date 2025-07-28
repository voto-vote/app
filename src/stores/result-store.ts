import { create } from "zustand";
import { Election } from "@/types/election";
import { Result } from "@/types/result";

type State = {
  results: {
    [electionId: Election["id"]]: Result[];
  };
};

type Action = {
  setResults: (
    electionId: Election["id"],
    partyResult: Result[],
    candidateResult: Result[]
  ) => void;
  clearResults: () => void;
};

export const useResultStore = create<State & Action>((set) => ({
  results: {},
  setResults: (electionId, partyResult, candidateResult) =>
    set((state) => ({
      results: {
        ...state.results,
        [electionId]: [
          ...(state.results[electionId] || []),
          ...partyResult,
          ...candidateResult,
        ],
      },
    })),
  clearResults: () => set({ results: {} }),
}));