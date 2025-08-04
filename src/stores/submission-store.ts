import { create } from "zustand";

type State = {
  resultID: string | undefined; // ID of the result, if any
  resultIDEnabled: boolean; // Whether the result ID is enabled or not
};

type Action = {
  setResultID: (id: NonNullable<State["resultID"]>) => void;
  clearResultID: () => void;
  enableResultID: () => void;
  disableResultID: () => void;
};

export const useResultIDStore = create<State & Action>((set) => ({
  resultID: undefined,
  resultIDEnabled: false,
  setResultID: (resultID) => set({ resultID }),
  clearResultID: () => set({ resultID: undefined }),
  enableResultID: () => set({ resultIDEnabled: true }),
  disableResultID: () => set({ resultIDEnabled: false }),
}));
