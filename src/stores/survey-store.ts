import { Election } from "@/types/election";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ElectionId = Election["id"];

type State = {
  surveyBeforeThesesSeen: Record<ElectionId, boolean>; // electionId -> seen status
  surveyAfterThesesSeen: Record<ElectionId, boolean>; // electionId -> seen status
};

type Action = {
  setSurveyBeforeThesesSeen: (electionId: ElectionId, seen: boolean) => void;
  setSurveyAfterThesesSeen: (electionId: ElectionId, seen: boolean) => void;
  isSurveyBeforeThesesSeen: (electionId: ElectionId) => boolean;
  isSurveyAfterThesesSeen: (electionId: ElectionId) => boolean;
};

export const useSurveyStore = create<State & Action>()(
  persist(
    (set, get) => ({
      surveyBeforeThesesSeen: {},
      surveyAfterThesesSeen: {},

      setSurveyBeforeThesesSeen: (electionId: ElectionId, seen: boolean) =>
        set((state) => ({
          surveyBeforeThesesSeen: {
            ...state.surveyBeforeThesesSeen,
            [electionId]: seen,
          },
        })),

      setSurveyAfterThesesSeen: (electionId: ElectionId, seen: boolean) =>
        set((state) => ({
          surveyAfterThesesSeen: {
            ...state.surveyAfterThesesSeen,
            [electionId]: seen,
          },
        })),

      isSurveyBeforeThesesSeen: (electionId: ElectionId) => {
        const state = get();
        return state.surveyBeforeThesesSeen[electionId] || false;
      },

      isSurveyAfterThesesSeen: (electionId: ElectionId) => {
        const state = get();
        return state.surveyAfterThesesSeen[electionId] || false;
      },
    }),
    {
      name: "voto-survey-seen",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
