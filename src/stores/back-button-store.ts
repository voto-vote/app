import { create } from "zustand";

type State = {
  backPath: string;
};

type Action = {
  setBackPath: (path: State["backPath"]) => void;
};

export const useBackButtonStore = create<State & Action>((set) => ({
  backPath: "/",
  setBackPath: (backPath) => set({ backPath }),
}));
