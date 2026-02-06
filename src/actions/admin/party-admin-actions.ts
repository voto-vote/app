"use server";

import type {
  AdminParty,
  CreatePartyRequest,
  UpdatePartyRequest,
  PremadePartyTemplate,
} from "@/types/admin";
import { simulateDelay, generateNumericId, now } from "@/lib/admin/mock-utils";
import { mockParties, mockPremadePartyTemplates } from "@/lib/admin/mock-data";

// In-memory store for mutations
let parties = [...mockParties];

export async function mockGetParties(
  electionId: number,
): Promise<AdminParty[]> {
  await simulateDelay(300);
  return parties.filter((p) => p.electionId === electionId);
}

export async function mockGetParty(id: number): Promise<AdminParty | null> {
  await simulateDelay(200);
  return parties.find((p) => p.id === id) || null;
}

export async function mockCreateParty(
  data: CreatePartyRequest,
): Promise<AdminParty> {
  await simulateDelay(400);

  const newParty: AdminParty = {
    ...data,
    id: generateNumericId(),
    agents: [],
    answerProgress: { total: 0, answered: 0, percentage: 0 },
    createdAt: now(),
    updatedAt: now(),
  };

  parties = [...parties, newParty];
  return newParty;
}

export async function mockUpdateParty(
  id: number,
  data: UpdatePartyRequest,
): Promise<AdminParty | null> {
  await simulateDelay(300);

  const index = parties.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: AdminParty = {
    ...parties[index],
    ...data,
    updatedAt: now(),
  };

  parties = [...parties.slice(0, index), updated, ...parties.slice(index + 1)];
  return updated;
}

export async function mockDeleteParty(id: number): Promise<boolean> {
  await simulateDelay(300);

  const index = parties.findIndex((p) => p.id === id);
  if (index === -1) return false;

  parties = [...parties.slice(0, index), ...parties.slice(index + 1)];
  return true;
}

export async function mockGetPremadePartyTemplates(): Promise<
  PremadePartyTemplate[]
> {
  await simulateDelay(300);
  return mockPremadePartyTemplates;
}

export async function mockCreatePartyFromTemplate(
  electionId: number,
  templateId: string,
): Promise<AdminParty | null> {
  await simulateDelay(400);

  const template = mockPremadePartyTemplates.find((t) => t.id === templateId);
  if (!template) return null;

  const newParty: AdminParty = {
    id: generateNumericId(),
    electionId,
    shortName: template.shortName,
    detailedName: template.detailedName,
    description: template.description || "",
    color: template.color,
    logo: template.logo,
    status: "created",
    isPublic: false,
    agents: [],
    answerProgress: { total: 0, answered: 0, percentage: 0 },
    createdAt: now(),
    updatedAt: now(),
  };

  parties = [...parties, newParty];
  return newParty;
}

export async function mockAddPartyAgent(
  partyId: number,
  email: string,
  firstName: string,
  lastName: string,
): Promise<AdminParty | null> {
  await simulateDelay(300);

  const index = parties.findIndex((p) => p.id === partyId);
  if (index === -1) return null;

  const newAgent = {
    id: generateNumericId(),
    userId: generateNumericId(),
    email,
    firstName,
    lastName,
    invitationStatus: "pending" as const,
  };

  const updated: AdminParty = {
    ...parties[index],
    agents: [...parties[index].agents, newAgent],
    updatedAt: now(),
  };

  parties = [...parties.slice(0, index), updated, ...parties.slice(index + 1)];
  return updated;
}

export async function mockRemovePartyAgent(
  partyId: number,
  agentId: number,
): Promise<AdminParty | null> {
  await simulateDelay(300);

  const index = parties.findIndex((p) => p.id === partyId);
  if (index === -1) return null;

  const updated: AdminParty = {
    ...parties[index],
    agents: parties[index].agents.filter((a) => a.id !== agentId),
    updatedAt: now(),
  };

  parties = [...parties.slice(0, index), updated, ...parties.slice(index + 1)];
  return updated;
}
