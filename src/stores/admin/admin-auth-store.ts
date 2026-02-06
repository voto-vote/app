import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AdminUser, Permission } from "@/types/admin";
import { RolePermissions } from "@/types/admin";

type State = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type Action = {
  setUser: (user: AdminUser | null) => void;
  clearUser: () => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  canAccessElection: (electionId: number) => boolean;
  canAccessParty: (partyId: number) => boolean;
};

export const useAdminAuthStore = create<State & Action>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),

      clearUser: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),

      logout: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        return RolePermissions[user.role].includes(permission);
      },

      hasAnyPermission: (permissions) => {
        const { hasPermission } = get();
        return permissions.some((p) => hasPermission(p));
      },

      canAccessElection: (electionId) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === "superadmin") return true;
        if (user.role === "electionadmin")
          return user.permissions.elections.includes(electionId);
        return false;
      },

      canAccessParty: (partyId) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === "superadmin" || user.role === "electionadmin")
          return true;
        if (user.role === "partyadmin")
          return user.permissions.parties.includes(partyId);
        return false;
      },
    }),
    {
      name: "voto-admin-auth",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
