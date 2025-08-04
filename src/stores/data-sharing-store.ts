import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  dataSharingEnabled: boolean; // Whether anonymous data sharing is enabled or not
  sharingId: string | undefined; // ID of the shared data, used for the survey
};

type Action = {
  enableDataSharing: () => void;
  disableDataSharing: () => void;
  setSharingId: (id: NonNullable<State["sharingId"]>) => void;
  clearSharingId: () => void;
};

export const useDataSharingStore = create<State & Action>()(
  persist(
    (set) => ({
      dataSharingEnabled: true,
      sharingId: undefined,
      enableDataSharing: () => set({ dataSharingEnabled: true }),
      disableDataSharing: () => set({ dataSharingEnabled: false }),
      setSharingId: (sharingId) => set({ sharingId }),
      clearSharingId: () => set({ sharingId: undefined }),
    }),
    {
      name: "voto-data-sharing",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
