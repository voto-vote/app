import { create } from "zustand";
import { Thesis } from "@/schemas/thesis";

type Theses = Array<Thesis>;

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
