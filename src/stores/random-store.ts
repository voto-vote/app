import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  seed: number;
  createSeed: () => void;
};

export const useRandomStore = create<State>()(
  persist(
    (set, get) => ({
      seed: 0,
      createSeed: () => {
        const currentSeed = get().seed;
        // Only generate a new seed if one doesn't exist
        if (!currentSeed) {
          set({ seed: generateSeed() });
        }
      },
    }),
    {
      name: "voto-random-seed",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && !state.seed) {
          state.createSeed();
        }
      },
    }
  )
);

function generateSeed(): number {
  return (Math.random() * 2 ** 32) >>> 0;
}
