export type AdminRole =
  | "superadmin"
  | "electionadmin"
  | "partyadmin"
  | "candidate";

export type AuthProvider =
  | "google"
  | "microsoft"
  | "apple"
  | "email-magic-link";

export type AdminUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  profilePicture?: string;
  agreedToTerms: boolean;
  agreedToTermsDate?: string;
  createdAt: string;
  lastLoginAt?: string;
  permissions: AdminPermissions;
};

export type AdminPermissions = {
  elections: number[]; // Election IDs for electionadmin
  parties: number[]; // Party IDs for partyadmin
  candidateId?: number; // Candidate ID for candidate role
};

export type LoginRequest = {
  provider: AuthProvider;
  email?: string; // For magic link
  redirectUrl?: string;
};

export type TermsAcceptance = {
  userId: number;
  version: string;
  acceptedAt: string;
  ipAddress?: string;
};
