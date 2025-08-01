import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  surveySeen: boolean;
  setSurveySeen: (seen: boolean) => void;
};

export const useSurveyStore = create<State>()(
  persist(
    (set) => ({
      surveySeen: false,
      setSurveySeen: (seen: boolean) => set({ surveySeen: seen }),
    }),
    {
      name: "voto-survey-seen",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
