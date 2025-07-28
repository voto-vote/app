import { create } from "zustand";
import { type Theses } from "@/types/theses";

type State = {
  theses: Theses | undefined;
};

type Action = {
  setTheses: (theses: NonNullable<State["theses"]>) => void;
  clearTheses: () => void;
};

export const useThesesStore = create<State & Action>((set) => ({
  theses: undefined,
  electionId: undefined,
  setTheses: (theses) => set({ theses }),
  clearTheses: () => set({ theses: undefined }),
}));
