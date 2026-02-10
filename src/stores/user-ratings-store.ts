import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Thesis } from "@/types/theses";
import { Election } from "@/types/election";
import { Ratings, RatingValue } from "@/types/ratings";
import z from "zod";

type State = {
  userRatings: {
    [electionId: Election["id"]]: Ratings;
  };
};

const v0StateSchema = z.object({
  userRatings: z.record(
    z.coerce.number(),
    z.record(
      z.coerce.number(),
      z.object({
        rating: z.number(),
        favorite: z.boolean(),
        timestamp: z.number().optional(),
      }),
    ),
  ),
});

type Action = {
  setUserRatingValue: (
    electionId: Election["id"],
    thesisId: Thesis["id"],
    value: RatingValue,
  ) => void;
  setUserRatingFavorite: (
    electionId: Election["id"],
    thesisId: Thesis["id"],
    isFavorite: boolean,
  ) => void;
};

export const useUserRatingsStore = create<State & Action>()(
  persist(
    (set) => ({
      userRatings: {},

      setUserRatingValue: (electionId, thesisId, value) =>
        set(({ userRatings }) => ({
          userRatings: {
            ...userRatings,
            [electionId]: {
              ...userRatings[electionId],
              [thesisId]: {
                ...(userRatings[electionId]?.[thesisId] ?? {
                  isFavorite: false,
                  ratedAt: undefined,
                }),
                value,
                ratedAt: Date.now(), // Set current timestamp when rating is given
              },
            },
          },
        })),

      setUserRatingFavorite: (electionId, thesisId, isFavorite) =>
        set(({ userRatings }) => {
          return {
            userRatings: {
              ...userRatings,
              [electionId]: {
                ...userRatings[electionId],
                [thesisId]: {
                  ...(userRatings[electionId]?.[thesisId] ?? {
                    value: "unrated",
                    ratedAt: undefined,
                  }),
                  isFavorite,
                },
              },
            },
          };
        }),
    }),
    {
      name: "voto-ratings",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState, version) => {
        switch (version) {
          case 0:
            persistedState = migrateV0ToV1(persistedState);
          // Future migrations can be added here as new cases (should fall through to the next case):
          //case 1:
          //  persistedState = migrateV1ToV2(persistedState);
        }
        return persistedState;
      },
    },
  ),
);

export function migrateV0ToV1(v0State: unknown): State {
  const { data, error, success } = v0StateSchema.safeParse(v0State);
  if (!success) {
    console.error(
      "Failed to parse persisted user ratings state during migration from version 0 to version 1:",
      error,
    );
    return { userRatings: {} };
  }
  // Migration from version 0 to version 1:
  // Convert rating values:
  //   undefined  ->  "unrated"
  //   -1         ->  "skipped"
  //   0 - 100    ->  0 - 1
  // favorite -> isFavorite
  const v1State: State = { userRatings: {} };

  for (const electionId in data.userRatings) {
    v1State.userRatings[electionId] = {};

    for (const thesisId in data.userRatings[electionId]) {
      const oldRating = data.userRatings[electionId][thesisId];

      let value: RatingValue;
      if (oldRating.rating === undefined) {
        value = "unrated";
      } else if (oldRating.rating === -1) {
        value = "skipped";
      } else {
        value = Math.max(0, Math.min(100, oldRating.rating)) / 100;
      }

      v1State.userRatings[electionId][thesisId] = {
        value,
        isFavorite: oldRating.favorite,
        ratedAt: oldRating.timestamp,
      };
    }
  }
  return v1State;
}
