import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Election } from "@/types/election";

type State = {
  bookmarks: {
    [electionId: Election["id"]]: {
      parties: string[];
      candidates: string[];
    };
  };
};

type Action = {
  toggleParty: (electionId: Election["id"], partyId: string) => void;
  toggleCandidate: (electionId: Election["id"], candidateId: string) => void;
};

export const useBookmarkStore = create<State & Action>()(
  persist(
    (set) => ({
      bookmarks: {},

      toggleParty: (electionId, partyId) =>
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            [electionId]: {
              ...state.bookmarks[electionId],
              parties: (state.bookmarks[electionId]?.parties ?? []).includes(
                partyId
              )
                ? state.bookmarks[electionId].parties.filter(
                    (id) => id !== partyId
                  )
                : [...(state.bookmarks[electionId]?.parties ?? []), partyId],
            },
          },
        })),

      toggleCandidate: (electionId, candidateId) =>
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            [electionId]: {
              ...state.bookmarks[electionId],
              candidates: (
                state.bookmarks[electionId]?.candidates ?? []
              ).includes(candidateId)
                ? state.bookmarks[electionId].candidates.filter(
                    (id) => id !== candidateId
                  )
                : [
                    ...(state.bookmarks[electionId]?.candidates ?? []),
                    candidateId,
                  ],
            },
          },
        })),
    }),
    { name: "voto-bookmarks", storage: createJSONStorage(() => localStorage) }
  )
);
