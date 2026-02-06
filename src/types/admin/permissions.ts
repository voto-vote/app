import type { AdminRole } from "./auth";

export type Permission =
  // Superadmin permissions
  | "manage:users"
  | "manage:all-elections"
  | "manage:groups"
  // Election admin permissions
  | "manage:election"
  | "manage:theses"
  | "manage:parties"
  | "manage:candidates"
  | "manage:invitations"
  | "manage:change-requests"
  | "manage:communication"
  | "view:answers"
  | "export:data"
  // Party admin permissions
  | "edit:party-profile"
  | "submit:party-answers"
  // Candidate permissions
  | "edit:candidate-profile"
  | "submit:candidate-answers";

export const RolePermissions: Record<AdminRole, Permission[]> = {
  superadmin: [
    "manage:users",
    "manage:all-elections",
    "manage:groups",
    "manage:election",
    "manage:theses",
    "manage:parties",
    "manage:candidates",
    "manage:invitations",
    "manage:change-requests",
    "manage:communication",
    "view:answers",
    "export:data",
    "edit:party-profile",
    "submit:party-answers",
    "edit:candidate-profile",
    "submit:candidate-answers",
  ],
  electionadmin: [
    "manage:election",
    "manage:theses",
    "manage:parties",
    "manage:candidates",
    "manage:invitations",
    "manage:change-requests",
    "manage:communication",
    "view:answers",
    "export:data",
  ],
  partyadmin: ["edit:party-profile", "submit:party-answers"],
  candidate: ["edit:candidate-profile", "submit:candidate-answers"],
};
