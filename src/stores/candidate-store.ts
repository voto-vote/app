import { create } from "zustand";
import { Candidates } from "@/types/candidate";

type State = {
  candidates: Candidates | undefined;
};

type Action = {
  setCandidates: (candidates: NonNullable<State["candidates"]>) => void;
  clearCandidates: () => void;
};

export const useCandidatesStore = create<State & Action>((set) => ({
  candidates: undefined,
  setCandidates: (candidates) => set({ candidates }),
  clearCandidates: () => set({ candidates: undefined }),
}));
