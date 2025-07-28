import { create } from "zustand";
import { Parties } from "@/types/party";

type State = {
  parties: Parties | undefined;
};

type Action = {
  setParties: (parties: NonNullable<State["parties"]>) => void;
  clearParties: () => void;
};

export const usePartiesStore = create<State & Action>((set) => ({
  parties: undefined,
  setParties: (parties) => set({ parties }),
  clearParties: () => set({ parties: undefined }),
}));
