import { create } from "zustand";

type State = {
  sharingID: string | undefined; // ID of the result, if any
  sharingIDEnabled: boolean; // Whether the result ID is enabled or not
};

type Action = {
  setSharingID: (id: NonNullable<State["sharingID"]>) => void;
  clearSharingID: () => void;
  enableSharingID: () => void;
  disableSharingID: () => void;
};

export const useSharingIDStore = create<State & Action>((set) => ({
  sharingID: undefined,
  sharingIDEnabled: false,
  setSharingID: (sharingID) => set({ sharingID }),
  clearSharingID: () => set({ sharingID: undefined }),
  enableSharingID: () => set({ sharingIDEnabled: true }),
  disableSharingID: () => set({ sharingIDEnabled: false }),
}));
