import { create } from "zustand";
import type { AdminElection, ElectionStage } from "@/types/admin";

type State = {
  currentElection: AdminElection | null;
  isDirty: boolean;
  pendingChanges: Partial<AdminElection>;
};

type Action = {
  setCurrentElection: (election: AdminElection | null) => void;
  updateField: <K extends keyof AdminElection>(
    field: K,
    value: AdminElection[K],
  ) => void;
  clearPendingChanges: () => void;
  canTransitionTo: (stage: ElectionStage) => boolean;
  getStageOrder: () => ElectionStage[];
};

const STAGE_ORDER: ElectionStage[] = [
  "created",
  "thesis-entry",
  "answering",
  "live",
  "archived",
];

export const useAdminElectionStore = create<State & Action>((set, get) => ({
  currentElection: null,
  isDirty: false,
  pendingChanges: {},

  setCurrentElection: (election) =>
    set({ currentElection: election, isDirty: false, pendingChanges: {} }),

  updateField: (field, value) =>
    set((state) => ({
      pendingChanges: { ...state.pendingChanges, [field]: value },
      isDirty: true,
    })),

  clearPendingChanges: () => set({ pendingChanges: {}, isDirty: false }),

  getStageOrder: () => STAGE_ORDER,

  canTransitionTo: (targetStage) => {
    const { currentElection } = get();
    if (!currentElection) return false;

    const currentIndex = STAGE_ORDER.indexOf(currentElection.stage);
    const targetIndex = STAGE_ORDER.indexOf(targetStage);

    // Can only move forward one stage at a time or back to previous stages
    return targetIndex === currentIndex + 1 || targetIndex < currentIndex;
  },
}));
