import { create } from "zustand";

type State = {
  selectedElectionIds: number[];
  selectedPartyIds: number[];
  selectedCandidateIds: number[];
  selectedThesisIds: string[];
};

type Action = {
  toggleElection: (id: number) => void;
  toggleParty: (id: number) => void;
  toggleCandidate: (id: number) => void;
  toggleThesis: (id: string) => void;
  selectAllElections: (ids: number[]) => void;
  selectAllParties: (ids: number[]) => void;
  selectAllCandidates: (ids: number[]) => void;
  selectAllTheses: (ids: string[]) => void;
  clearElectionSelection: () => void;
  clearPartySelection: () => void;
  clearCandidateSelection: () => void;
  clearThesisSelection: () => void;
  clearAll: () => void;
};

export const useAdminBulkEditStore = create<State & Action>((set) => ({
  selectedElectionIds: [],
  selectedPartyIds: [],
  selectedCandidateIds: [],
  selectedThesisIds: [],

  toggleElection: (id) =>
    set((state) => ({
      selectedElectionIds: state.selectedElectionIds.includes(id)
        ? state.selectedElectionIds.filter((i) => i !== id)
        : [...state.selectedElectionIds, id],
    })),

  toggleParty: (id) =>
    set((state) => ({
      selectedPartyIds: state.selectedPartyIds.includes(id)
        ? state.selectedPartyIds.filter((i) => i !== id)
        : [...state.selectedPartyIds, id],
    })),

  toggleCandidate: (id) =>
    set((state) => ({
      selectedCandidateIds: state.selectedCandidateIds.includes(id)
        ? state.selectedCandidateIds.filter((i) => i !== id)
        : [...state.selectedCandidateIds, id],
    })),

  toggleThesis: (id) =>
    set((state) => ({
      selectedThesisIds: state.selectedThesisIds.includes(id)
        ? state.selectedThesisIds.filter((i) => i !== id)
        : [...state.selectedThesisIds, id],
    })),

  selectAllElections: (ids) => set({ selectedElectionIds: ids }),
  selectAllParties: (ids) => set({ selectedPartyIds: ids }),
  selectAllCandidates: (ids) => set({ selectedCandidateIds: ids }),
  selectAllTheses: (ids) => set({ selectedThesisIds: ids }),

  clearElectionSelection: () => set({ selectedElectionIds: [] }),
  clearPartySelection: () => set({ selectedPartyIds: [] }),
  clearCandidateSelection: () => set({ selectedCandidateIds: [] }),
  clearThesisSelection: () => set({ selectedThesisIds: [] }),

  clearAll: () =>
    set({
      selectedElectionIds: [],
      selectedPartyIds: [],
      selectedCandidateIds: [],
      selectedThesisIds: [],
    }),
}));
