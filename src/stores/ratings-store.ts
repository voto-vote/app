import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Thesis } from "@/schemas/thesis";

type State = {
  ratings: Record<Thesis["id"], number>;
  stars: Array<Thesis["id"]>;
};

type Action = {
  setRating: (thesisId: Thesis["id"], rating: number) => void;
  setStar: (thesisId: Thesis["id"], star: boolean) => void;
  clear: () => void;
};

export const useRatingsStore = create<State & Action>()(
  persist(
    (set) => ({
      ratings: {},
      stars: [],
      setRating: (thesisId, rating) =>
        set((state) => ({
          ratings: {
            ...state.ratings,
            [thesisId]: rating,
          },
        })),
      setStar: (thesisId, star) =>
        set((state) => {
          const alreadyStarred = state.stars.includes(thesisId);
          if (alreadyStarred && !star) {
            return { stars: state.stars.filter((id) => id !== thesisId) };
          }
          if (!alreadyStarred && star) {
            return { stars: [...state.stars, thesisId] };
          }
          return { stars: state.stars };
        }),
      clear: () => set({ ratings: {}, stars: [] }),
    }),
    { name: "voto-ratings", storage: createJSONStorage(() => localStorage) }
  )
);
