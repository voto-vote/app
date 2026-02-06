"use server";

import type { AdminParty, AdminCandidate, AdminThesis } from "@/types/admin";
import { simulateDelay, now } from "@/lib/admin/mock-utils";
import { mockParties, mockCandidates, mockTheses } from "@/lib/admin/mock-data";

// ============================================
// PARTY PORTAL ACTIONS
// ============================================

export async function mockGetMyParty(
  partyId: number,
): Promise<AdminParty | null> {
  await simulateDelay(200);
  return mockParties.find((p) => p.id === partyId) || null;
}

export async function mockUpdateMyParty(
  partyId: number,
  data: Partial<AdminParty>,
): Promise<AdminParty | null> {
  await simulateDelay(300);

  const party = mockParties.find((p) => p.id === partyId);
  if (!party) return null;

  return {
    ...party,
    ...data,
    updatedAt: now(),
  };
}

export async function mockGetMyTheses(
  electionId: number,
): Promise<AdminThesis[]> {
  await simulateDelay(300);
  return mockTheses
    .filter((t) => t.electionId === electionId)
    .sort((a, b) => a.order - b.order);
}

export async function mockSubmitPartyAnswer(
  partyId: number,
  thesisId: string,
  answer: { value: number; explanation: string },
): Promise<boolean> {
  await simulateDelay(300);

  console.log(
    `Mock submit party answer: partyId=${partyId}, thesisId=${thesisId}, value=${answer.value}`,
  );

  return true;
}

export async function mockGetPartyAnswers(
  partyId: number,
): Promise<Record<string, { value: number; explanation: string }>> {
  await simulateDelay(200);

  // Mock answers
  return {
    "thesis-1": {
      value: 4,
      explanation: "Wir unterstützen den Ausbau von Fahrradwegen.",
    },
    "thesis-2": { value: 3, explanation: "Mit gewissen Einschränkungen." },
  };
}

// ============================================
// CANDIDATE PORTAL ACTIONS
// ============================================

export async function mockGetMyCandidate(
  candidateId: number,
): Promise<AdminCandidate | null> {
  await simulateDelay(200);
  return mockCandidates.find((c) => c.id === candidateId) || null;
}

export async function mockUpdateMyCandidate(
  candidateId: number,
  data: Partial<AdminCandidate>,
): Promise<AdminCandidate | null> {
  await simulateDelay(300);

  const candidate = mockCandidates.find((c) => c.id === candidateId);
  if (!candidate) return null;

  return {
    ...candidate,
    ...data,
    updatedAt: now(),
  };
}

export async function mockSubmitCandidateAnswer(
  candidateId: number,
  thesisId: string,
  answer: { value: number; explanation: string },
): Promise<boolean> {
  await simulateDelay(300);

  console.log(
    `Mock submit candidate answer: candidateId=${candidateId}, thesisId=${thesisId}, value=${answer.value}`,
  );

  return true;
}

export async function mockGetCandidateAnswers(
  candidateId: number,
): Promise<Record<string, { value: number; explanation: string }>> {
  await simulateDelay(200);

  // Mock answers
  return {
    "thesis-1": {
      value: 5,
      explanation: "Volle Unterstützung für nachhaltige Mobilität.",
    },
    "thesis-2": {
      value: 4,
      explanation: "Mehr Kindergartenplätze sind wichtig.",
    },
    "thesis-3": {
      value: 2,
      explanation: "Steuerentlastungen müssen finanzierbar sein.",
    },
  };
}

// ============================================
// CHANGE REQUEST PORTAL ACTIONS
// ============================================

export async function mockRequestProfileChange(
  entityType: "party" | "candidate",
  entityId: number,
  changes: { field: string; currentValue: unknown; requestedValue: unknown }[],
  description: string,
): Promise<boolean> {
  await simulateDelay(400);

  console.log(
    `Mock profile change request: ${entityType}=${entityId}, fields=${changes.map((c) => c.field).join(",")}`,
  );
  console.log(`Description: ${description}`);

  return true;
}

export async function mockRequestAnswerChange(
  entityType: "party" | "candidate",
  entityId: number,
  thesisId: string,
  currentAnswer: { value: number; explanation: string },
  requestedAnswer: { value: number; explanation: string },
  description: string,
): Promise<boolean> {
  await simulateDelay(400);

  console.log(
    `Mock answer change request: ${entityType}=${entityId}, thesis=${thesisId}`,
  );
  console.log(`From: ${currentAnswer.value} -> To: ${requestedAnswer.value}`);
  console.log(`Description: ${description}`);

  return true;
}
