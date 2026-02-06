import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AdminParty, AdminCandidate } from "@/types/admin";

type AnswerDraft = {
  thesisId: string;
  value: number;
  explanation: string;
};

type State = {
  // Context
  currentParty: AdminParty | null;
  currentCandidate: AdminCandidate | null;
  // Answer drafts (not yet submitted)
  partyAnswerDrafts: Record<string, AnswerDraft>;
  candidateAnswerDrafts: Record<string, AnswerDraft>;
};

type Action = {
  setCurrentParty: (party: AdminParty | null) => void;
  setCurrentCandidate: (candidate: AdminCandidate | null) => void;
  setPartyAnswerDraft: (thesisId: string, draft: Partial<AnswerDraft>) => void;
  setCandidateAnswerDraft: (
    thesisId: string,
    draft: Partial<AnswerDraft>,
  ) => void;
  clearPartyAnswerDrafts: () => void;
  clearCandidateAnswerDrafts: () => void;
  getPartyAnswerDraft: (thesisId: string) => AnswerDraft | undefined;
  getCandidateAnswerDraft: (thesisId: string) => AnswerDraft | undefined;
};

export const usePortalStore = create<State & Action>()(
  persist(
    (set, get) => ({
      currentParty: null,
      currentCandidate: null,
      partyAnswerDrafts: {},
      candidateAnswerDrafts: {},

      setCurrentParty: (party) => set({ currentParty: party }),

      setCurrentCandidate: (candidate) => set({ currentCandidate: candidate }),

      setPartyAnswerDraft: (thesisId, draft) =>
        set((state) => ({
          partyAnswerDrafts: {
            ...state.partyAnswerDrafts,
            [thesisId]: {
              thesisId,
              value:
                draft.value ?? state.partyAnswerDrafts[thesisId]?.value ?? 0,
              explanation:
                draft.explanation ??
                state.partyAnswerDrafts[thesisId]?.explanation ??
                "",
            },
          },
        })),

      setCandidateAnswerDraft: (thesisId, draft) =>
        set((state) => ({
          candidateAnswerDrafts: {
            ...state.candidateAnswerDrafts,
            [thesisId]: {
              thesisId,
              value:
                draft.value ??
                state.candidateAnswerDrafts[thesisId]?.value ??
                0,
              explanation:
                draft.explanation ??
                state.candidateAnswerDrafts[thesisId]?.explanation ??
                "",
            },
          },
        })),

      clearPartyAnswerDrafts: () => set({ partyAnswerDrafts: {} }),

      clearCandidateAnswerDrafts: () => set({ candidateAnswerDrafts: {} }),

      getPartyAnswerDraft: (thesisId) => get().partyAnswerDrafts[thesisId],

      getCandidateAnswerDraft: (thesisId) =>
        get().candidateAnswerDrafts[thesisId],
    }),
    {
      name: "voto-portal",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        partyAnswerDrafts: state.partyAnswerDrafts,
        candidateAnswerDrafts: state.candidateAnswerDrafts,
      }),
    },
  ),
);
