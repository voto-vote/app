import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ElectionId = number; // Adjust this type based on your election ID structure

type State = {
  surveysSeen: Record<ElectionId, boolean>; // electionId -> seen status
};

type Action = {
  setSurveySeen: (electionId: ElectionId, seen: boolean) => void;
  isSurveySeen: (electionId: ElectionId) => boolean;
  clearSurveyData: (electionId?: ElectionId) => void;
};

export const useSurveyStore = create<State & Action>()(
  persist(
    (set, get) => ({
      surveysSeen: {},
      
      setSurveySeen: (electionId: ElectionId, seen: boolean) =>
        set((state) => ({
          surveysSeen: {
            ...state.surveysSeen,
            [electionId]: seen,
          },
        })),
      
      isSurveySeen: (electionId: ElectionId) => {
        const state = get();
        return state.surveysSeen[electionId] || false;
      },
      
      clearSurveyData: (electionId?: ElectionId) =>
        set((state) => {
          if (electionId !== undefined) {
            // Clear specific election
            const { [electionId]: _, ...rest } = state.surveysSeen;
            return { surveysSeen: rest };
          } else {
            // Clear all elections
            return { surveysSeen: {} };
          }
        }),
    }),
    {
      name: "voto-survey-seen",
      storage: createJSONStorage(() => localStorage),
    }
  )
);