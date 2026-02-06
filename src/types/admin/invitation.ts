import type { InvitationStatus } from "./party-admin";

export type InvitationType = "party-agent" | "candidate";

export type Invitation = {
  id: string;
  type: InvitationType;
  electionId: number;
  recipientEmail: string;
  recipientName: string;
  targetId: number; // partyId or candidateId
  templateId: string;
  status: InvitationStatus;
  sentAt?: string;
  expiresAt: string;
  acceptedAt?: string;
  token: string;
};

export type EmailTemplate = {
  id: string;
  electionId: number;
  name: string;
  type: InvitationType;
  subject: string;
  body: string; // HTML with placeholders
  placeholders: TemplatePlaceholder[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TemplatePlaceholder = {
  key: string;
  description: string;
  example: string;
};

export type SendInvitationRequest = {
  type: InvitationType;
  recipientIds: number[]; // partyIds or candidateIds
  templateId: string;
  customMessage?: string;
};

export type ReminderRequest = {
  type: InvitationType;
  recipientIds: number[];
  templateId: string;
};
