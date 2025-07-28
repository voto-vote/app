import { create } from "zustand";
import { Election } from "@/types/election";
import { Candidate } from "@/types/candidate";

type State = {
  candidates: Candidate[] | undefined;
  electionId: Election["id"] | undefined;
};

type Action = {
  setCandidates: (
    candidates: NonNullable<State["candidates"]>,
    electionId: NonNullable<State["electionId"]>
  ) => void;
  clearCandidates: () => void;
};

export const useCandidatesStore = create<State & Action>((set) => ({
  candidates: undefined,
  electionId: undefined,
  setCandidates: (candidates, electionId) => set({ candidates, electionId }),
  clearCandidates: () => set({ candidates: undefined, electionId: undefined }),
}));
