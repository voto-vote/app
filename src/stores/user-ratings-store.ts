import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Thesis } from "@/types/theses";
import { Election } from "@/types/election";
import { Ratings } from "@/types/ratings";

type State = {
  userRatings: {
    [electionId: Election["id"]]: Ratings;
  };
};

type Action = {
  setUserRating: (
    electionId: Election["id"],
    thesisId: Thesis["id"],
    rating: number
  ) => void;
  setUserFavorite: (
    electionId: Election["id"],
    thesisId: Thesis["id"],
    favorite: boolean
  ) => void;
};

export const useUserRatingsStore = create<State & Action>()(
  persist(
    (set) => ({
      userRatings: {},

      setUserRating: (electionId, thesisId, rating) =>
        set((state) => ({
          userRatings: {
            ...state.userRatings,
            [electionId]: {
              ...state.userRatings[electionId],
              [thesisId]: {
                ...(state.userRatings[electionId]?.[thesisId] ?? {
                  favorite: false,
                  timestamp: Date.now(), // Set current timestamp when rating is given
                }),
                rating,
              },
            },
          },
        })),

      setUserFavorite: (electionId, thesisId, favorite) =>
        set((state) => {
          return {
            userRatings: {
              ...state.userRatings,
              [electionId]: {
                ...state.userRatings[electionId],
                [thesisId]: {
                  ...(state.userRatings[electionId]?.[thesisId] ?? {
                    rating: undefined,
                    timestamp: undefined,
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
