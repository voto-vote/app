import { create } from "zustand";
import { Party } from "@/types/party";

type State = {
  parties: Party[] | undefined;
};

type Action = {
  setParties: (
    parties: NonNullable<State["parties"]>,
  ) => void;
  clearParties: () => void;
};

export const usePartiesStore = create<State & Action>((set) => ({
  parties: undefined,
  partyVotes: undefined,
  electionId: undefined,
  setParties: (parties) => set({ parties }),
  clearParties: () => set({ parties: undefined }),
}));
