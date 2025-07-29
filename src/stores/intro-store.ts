import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
  seenIntro: boolean;
  setSeenIntro: (seen: boolean) => void;
};

export const useIntroStore = create<State>()(
  persist(
    (set) => ({
      seenIntro: false,
      setSeenIntro: (seen: boolean) => set({ seenIntro: seen }),
    }),
    {
      name: "voto-intro-seen",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
