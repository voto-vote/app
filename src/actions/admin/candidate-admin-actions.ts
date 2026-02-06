"use server";

import type {
  AdminCandidate,
  CreateCandidateRequest,
  UpdateCandidateRequest,
} from "@/types/admin";
import { simulateDelay, generateNumericId, now } from "@/lib/admin/mock-utils";
import { mockCandidates, mockParties } from "@/lib/admin/mock-data";

// In-memory store for mutations
let candidates = [...mockCandidates];

export async function mockGetCandidates(
  electionId: number,
): Promise<AdminCandidate[]> {
  await simulateDelay(300);
  return candidates.filter((c) => c.electionId === electionId);
}

export async function mockGetCandidate(
  id: number,
): Promise<AdminCandidate | null> {
  await simulateDelay(200);
  return candidates.find((c) => c.id === id) || null;
}

export async function mockCreateCandidate(
  data: CreateCandidateRequest,
): Promise<AdminCandidate> {
  await simulateDelay(400);

  // Get party name
  const party = mockParties.find((p) => p.id === data.partyId);

  const newCandidate: AdminCandidate = {
    ...data,
    id: generateNumericId(),
    partyName: party?.shortName || "Unknown",
    answerProgress: { total: 0, answered: 0, percentage: 0 },
    createdAt: now(),
    updatedAt: now(),
  };

  candidates = [...candidates, newCandidate];
  return newCandidate;
}

export async function mockUpdateCandidate(
  id: number,
  data: UpdateCandidateRequest,
): Promise<AdminCandidate | null> {
  await simulateDelay(300);

  const index = candidates.findIndex((c) => c.id === id);
  if (index === -1) return null;

  // Get party name if party changed
  let partyName = candidates[index].partyName;
  if (data.partyId && data.partyId !== candidates[index].partyId) {
    const party = mockParties.find((p) => p.id === data.partyId);
    partyName = party?.shortName || "Unknown";
  }

  const updated: AdminCandidate = {
    ...candidates[index],
    ...data,
    partyName,
    updatedAt: now(),
  };

  candidates = [
    ...candidates.slice(0, index),
    updated,
    ...candidates.slice(index + 1),
  ];
  return updated;
}

export async function mockDeleteCandidate(id: number): Promise<boolean> {
  await simulateDelay(300);

  const index = candidates.findIndex((c) => c.id === id);
  if (index === -1) return false;

  candidates = [...candidates.slice(0, index), ...candidates.slice(index + 1)];
  return true;
}

export async function mockGetCandidatesByParty(
  partyId: number,
): Promise<AdminCandidate[]> {
  await simulateDelay(200);
  return candidates.filter((c) => c.partyId === partyId);
}

export async function mockBulkCreateCandidates(
  candidates: CreateCandidateRequest[],
): Promise<AdminCandidate[]> {
  await simulateDelay(600);

  const created: AdminCandidate[] = [];

  for (const data of candidates) {
    const party = mockParties.find((p) => p.id === data.partyId);
    const newCandidate: AdminCandidate = {
      ...data,
      id: generateNumericId(),
      partyName: party?.shortName || "Unknown",
      answerProgress: { total: 0, answered: 0, percentage: 0 },
      createdAt: now(),
      updatedAt: now(),
    };
    created.push(newCandidate);
  }

  candidates = [...candidates, ...created];
  return created;
}
