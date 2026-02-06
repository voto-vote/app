import type { InvitationStatus, AnswerProgress } from "./party-admin";

export type AdminCandidate = {
  id: number;
  electionId: number;
  userId: number;
  partyId: number;
  partyName: string;
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  dateOfBirth?: string;
  description: string;
  district?: string;
  listPlace?: number;
  website?: string;
  profilePicture?: string;
  status: CandidateStatus;
  isPublic: boolean;
  invitationStatus: InvitationStatus;
  answerProgress: AnswerProgress;
  createdAt: string;
  updatedAt: string;
};

export type CandidateStatus =
  | "created"
  | "invited"
  | "active"
  | "voted"
  | "deactivated";

export type CreateCandidateRequest = Omit<
  AdminCandidate,
  "id" | "createdAt" | "updatedAt" | "answerProgress" | "partyName"
>;
export type UpdateCandidateRequest = Partial<CreateCandidateRequest>;
