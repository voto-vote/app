import { create } from "zustand";
import { Election } from "@/schemas/election";

type State = {
  election: Election | undefined;
};

type Action = {
  setElection: (election: State["election"]) => void;
  clearElection: () => void;
};

export const useElectionStore = create<State & Action>((set) => ({
  election: undefined,
  setElection: (election) => set({ election }),
  clearElection: () => set({ election: undefined }),
}));
