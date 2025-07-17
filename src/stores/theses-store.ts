import { create } from "zustand";
import { type Theses } from "@/types/theses";

type State = {
  theses: Theses | undefined;
  electionId: string | undefined;
};

type Action = {
  setTheses: (
    theses: NonNullable<State["theses"]>,
    electionId: NonNullable<State["electionId"]>
  ) => void;
  clearTheses: () => void;
};

export const useThesesStore = create<State & Action>((set) => ({
  theses: undefined,
  electionId: undefined,
  setTheses: (theses, electionId) => set({ theses, electionId }),
  clearTheses: () => set({ theses: undefined, electionId: undefined }),
}));
