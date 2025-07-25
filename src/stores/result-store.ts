import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Election } from "@/types/election";
import { Result } from "@/types/result";

type State = {
  results: {
    [electionId: Election["id"]]: Result[];
  };
};

type Action = {
  setResult: (
    electionId: Election["id"],
    partyResult: Result[],
    candidateResult: Result[]
  ) => void;
};

export const useResultStore = create<State & Action>()(
  persist(
    (set) => ({
      results: {},

      setResult: (electionId, partyResult, candidateResult) =>
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
    }),
    { name: "voto-results", storage: createJSONStorage(() => localStorage) }
  )
);
