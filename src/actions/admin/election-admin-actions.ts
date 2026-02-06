"use server";

import type {
  AdminElection,
  CreateElectionRequest,
  UpdateElectionRequest,
  ElectionStage,
} from "@/types/admin";
import { simulateDelay, generateNumericId, now } from "@/lib/admin/mock-utils";
import { mockElections } from "@/lib/admin/mock-data";

// In-memory store for mutations (would be replaced by real DB)
let elections = [...mockElections];

export async function mockGetElections(): Promise<AdminElection[]> {
  await simulateDelay(300);
  return elections;
}

export async function mockGetElection(
  id: number,
): Promise<AdminElection | null> {
  await simulateDelay(200);
  return elections.find((e) => e.id === id) || null;
}

export async function mockGetElectionsByGroup(
  groupId: number,
): Promise<AdminElection[]> {
  await simulateDelay(200);
  return elections.filter((e) => e.groupId === groupId);
}

export async function mockCreateElection(
  data: CreateElectionRequest,
): Promise<AdminElection> {
  await simulateDelay(500);

  const newElection: AdminElection = {
    ...data,
    id: generateNumericId(),
    createdAt: now(),
    updatedAt: now(),
    createdBy: 1, // Mock current user
  };

  elections = [...elections, newElection];
  return newElection;
}

export async function mockUpdateElection(
  id: number,
  data: UpdateElectionRequest,
): Promise<AdminElection | null> {
  await simulateDelay(300);

  const index = elections.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const updated: AdminElection = {
    ...elections[index],
    ...data,
    updatedAt: now(),
  };

  elections = [
    ...elections.slice(0, index),
    updated,
    ...elections.slice(index + 1),
  ];
  return updated;
}

export async function mockDeleteElection(id: number): Promise<boolean> {
  await simulateDelay(300);

  const index = elections.findIndex((e) => e.id === id);
  if (index === -1) return false;

  elections = [...elections.slice(0, index), ...elections.slice(index + 1)];
  return true;
}

export async function mockChangeElectionStage(
  id: number,
  newStage: ElectionStage,
): Promise<AdminElection | null> {
  await simulateDelay(400);

  const index = elections.findIndex((e) => e.id === id);
  if (index === -1) return null;

  // Validate stage transition
  const stageOrder: ElectionStage[] = [
    "created",
    "thesis-entry",
    "answering",
    "live",
    "archived",
  ];
  const currentIndex = stageOrder.indexOf(elections[index].stage);
  const targetIndex = stageOrder.indexOf(newStage);

  // Can only move forward one stage at a time or back to previous stages
  if (targetIndex !== currentIndex + 1 && targetIndex >= currentIndex) {
    throw new Error(
      `Invalid stage transition from ${elections[index].stage} to ${newStage}`,
    );
  }

  const updated: AdminElection = {
    ...elections[index],
    stage: newStage,
    updatedAt: now(),
  };

  elections = [
    ...elections.slice(0, index),
    updated,
    ...elections.slice(index + 1),
  ];
  return updated;
}

export async function mockDuplicateElection(
  id: number,
): Promise<AdminElection | null> {
  await simulateDelay(500);

  const original = elections.find((e) => e.id === id);
  if (!original) return null;

  const duplicate: AdminElection = {
    ...original,
    id: generateNumericId(),
    name: `${original.name} (Copy)`,
    title: `${original.title} (Copy)`,
    stage: "created",
    createdAt: now(),
    updatedAt: now(),
  };

  elections = [...elections, duplicate];
  return duplicate;
}
