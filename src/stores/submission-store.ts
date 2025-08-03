import { create } from "zustand";

type State = {
  resultID: string | null; // ID of the result, if any
};

type Action = {
  setResultID: (id: string | null) => void;
  clearResultID: () => void;
};

export const useResultIDStore = create<State & Action>((set) => ({
  resultID: null,
  setResultID: (id) => set({ resultID: id }),
  clearResultID: () => set({ resultID: null }),
}));
