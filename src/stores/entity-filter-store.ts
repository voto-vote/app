import { create } from "zustand";
import { EntityFilters } from "@/types/entity-filter";

type State = {
  entityFilters: EntityFilters;
};

type Action = {
  setEntityFilters: (filters: State["entityFilters"]) => void;
  clearEntityFilters: () => void;
};

export const useEntityFilterStore = create<State & Action>((set) => ({
  entityFilters: {},
  setEntityFilters: (filters) => set({ entityFilters: filters }),
  clearEntityFilters: () => set({ entityFilters: {} }),
}));
