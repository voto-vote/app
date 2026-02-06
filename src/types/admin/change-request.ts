import type { AdminRole } from "./auth";

export type ChangeRequestType = "thesis" | "party" | "candidate" | "answer";

export type ChangeRequestStatus = "pending" | "approved" | "rejected";

export type ChangeRequest = {
  id: string;
  electionId: number;
  type: ChangeRequestType;
  targetId: string | number;
  requestedBy: number;
  requestedByName: string;
  requestedByRole: AdminRole;
  description: string;
  changes: ChangeDetail[];
  status: ChangeRequestStatus;
  reviewedBy?: number;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
};

export type ChangeDetail = {
  field: string;
  currentValue: unknown;
  requestedValue: unknown;
};

export type CreateChangeRequestRequest = Omit<
  ChangeRequest,
  | "id"
  | "status"
  | "reviewedBy"
  | "reviewedAt"
  | "reviewNotes"
  | "createdAt"
  | "requestedByName"
>;

export type ReviewChangeRequestRequest = {
  status: "approved" | "rejected";
  reviewNotes?: string;
};
