import { create } from "zustand";
import { Election } from "@/types/election";
import { Party } from "@/types/party";

type State = {
  parties: Party[] | undefined;
  electionId: Election["id"] | undefined;
};

type Action = {
  setParties: (
    parties: NonNullable<State["parties"]>,
    electionId: NonNullable<State["electionId"]>
  ) => void;
  clearParties: () => void;
};

export const usePartiesStore = create<State & Action>((set) => ({
  parties: undefined,
  partyVotes: undefined,
  electionId: undefined,
  setParties: (parties, electionId) => set({ parties, electionId }),
  clearParties: () => set({ parties: undefined, electionId: undefined }),
}));
