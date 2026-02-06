import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  thesesIntroSeen: boolean;
  resultIntroSeen: boolean;
};

type Action = {
  setThesesIntroSeen: (seen: boolean) => void;
  setResultIntroSeen: (seen: boolean) => void;
};

export const useIntroStore = create<State & Action>()(
  persist(
    (set) => ({
      thesesIntroSeen: false,
      resultIntroSeen: false,
      setThesesIntroSeen: (seen: boolean) => set({ thesesIntroSeen: seen }),
      setResultIntroSeen: (seen: boolean) => set({ resultIntroSeen: seen }),
    }),
    {
      name: "voto-intro-seen",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
