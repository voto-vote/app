import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  introSeen: boolean;
  setIntroSeen: (seen: boolean) => void;
};

export const useIntroStore = create<State>()(
  persist(
    (set) => ({
      introSeen: false,
      setIntroSeen: (seen: boolean) => set({ introSeen: seen }),
    }),
    {
      name: "voto-intro-seen",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
