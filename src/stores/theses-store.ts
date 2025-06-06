import { create } from "zustand";
import { Thesis } from "@/schemas/thesis";

type Theses = Array<Thesis>;

type State = {
  theses: Theses | undefined;
};

type Action = {
  setTheses: (theses: State["theses"]) => void;
  clearTheses: () => void;
};

export const useThesesStore = create<State & Action>((set) => ({
  theses: undefined,
  setTheses: (theses) => set({ theses }),
  clearTheses: () => set({ theses: undefined }),
}));
