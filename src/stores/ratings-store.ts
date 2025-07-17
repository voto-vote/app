import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Thesis } from "@/types/theses";
import { Election } from "@/types/election";
import { Ratings } from "@/types/ratings";

type State = {
  ratings: {
    [electionId: Election["id"]]: Ratings;
  };
};

type Action = {
  setRating: (
    electionId: Election["id"],
    thesisId: Thesis["id"],
    rating: number
  ) => void;
  setFavorite: (
    electionId: Election["id"],
    thesisId: Thesis["id"],
    favorite: boolean
  ) => void;
};

export const useRatingsStore = create<State & Action>()(
  persist(
    (set) => ({
      ratings: {},

      setRating: (electionId, thesisId, rating) =>
        set((state) => ({
          ratings: {
            ...state.ratings,
            [electionId]: {
              ...state.ratings[electionId],
              [thesisId]: {
                ...(state.ratings[electionId]?.[thesisId] ?? {
                  favorite: false,
                }),
                rating,
              },
            },
          },
        })),

      setFavorite: (electionId, thesisId, favorite) =>
        set((state) => {
          return {
            ratings: {
              ...state.ratings,
              [electionId]: {
                ...state.ratings[electionId],
                [thesisId]: {
                  ...(state.ratings[electionId]?.[thesisId] ?? {
                    rating: undefined,
                  }),
                  favorite: favorite,
                },
              },
            },
          };
        }),
    }),
    { name: "voto-ratings", storage: createJSONStorage(() => localStorage) }
  )
);
