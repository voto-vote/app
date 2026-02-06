import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  isCollapsed: boolean;
  activeSection: string;
};

type Action = {
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setActiveSection: (section: string) => void;
};

export const useAdminSidebarStore = create<State & Action>()(
  persist(
    (set) => ({
      isCollapsed: false,
      activeSection: "dashboard",

      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      setCollapsed: (isCollapsed) => set({ isCollapsed }),

      setActiveSection: (activeSection) => set({ activeSection }),
    }),
    {
      name: "voto-admin-sidebar",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
