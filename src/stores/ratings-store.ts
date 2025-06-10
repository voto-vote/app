import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Thesis } from "@/schemas/thesis";

type State = {
  ratings: Record<Thesis["id"], number>;
};

type Action = {
  setRating: (thesisId: Thesis["id"], rating: number) => void;
  clearRatings: () => void;
};

export const useRatingsStore = create<State & Action>()(
  persist(
    (set) => ({
      ratings: {},
      setRating: (thesisId, rating) =>
        set((state) => ({
          ratings: {
            ...state.ratings,
            [thesisId]: rating,
          },
        })),
      clearRatings: () => set({ ratings: {} }),
    }),
    { name: "voto-ratings", storage: createJSONStorage(() => localStorage) }
  )
);
