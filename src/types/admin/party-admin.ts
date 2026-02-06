export type AdminParty = {
  id: number;
  electionId: number;
  parentPartyId?: number;
  shortName: string;
  detailedName: string;
  description: string;
  website?: string;
  color: string;
  logo?: string;
  status: PartyStatus;
  isPublic: boolean;
  agents: PartyAgent[];
  answerProgress: AnswerProgress;
  createdAt: string;
  updatedAt: string;
};

export type PartyStatus =
  | "created"
  | "invited"
  | "active"
  | "voted"
  | "deactivated";

export type PartyAgent = {
  id: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  invitationStatus: InvitationStatus;
  invitedAt?: string;
  acceptedAt?: string;
};

export type InvitationStatus =
  | "pending"
  | "sent"
  | "accepted"
  | "expired"
  | "declined";

export type AnswerProgress = {
  total: number;
  answered: number;
  percentage: number;
};

export type PremadePartyTemplate = {
  id: string;
  shortName: string;
  detailedName: string;
  color: string;
  logo: string;
  description?: string;
};

export type CreatePartyRequest = Omit<
  AdminParty,
  "id" | "createdAt" | "updatedAt" | "agents" | "answerProgress"
>;
export type UpdatePartyRequest = Partial<CreatePartyRequest>;
