"use server";

import type {
  ElectionGroup,
  CreateGroupRequest,
  UpdateGroupRequest,
  MoveElectionToGroupRequest,
  BulkEditRequest,
} from "@/types/admin";
import { simulateDelay, generateNumericId, now } from "@/lib/admin/mock-utils";
import { mockElectionGroups } from "@/lib/admin/mock-data";

// In-memory store
let groups = [...mockElectionGroups];

export async function mockGetGroups(): Promise<ElectionGroup[]> {
  await simulateDelay(300);
  return groups;
}

export async function mockGetGroup(id: number): Promise<ElectionGroup | null> {
  await simulateDelay(200);
  return groups.find((g) => g.id === id) || null;
}

export async function mockCreateGroup(
  data: CreateGroupRequest,
): Promise<ElectionGroup> {
  await simulateDelay(400);

  const newGroup: ElectionGroup = {
    id: generateNumericId(),
    name: data.name,
    electionDate: data.electionDate,
    elections: [],
    createdAt: now(),
    updatedAt: now(),
    createdBy: 1, // Mock current user
  };

  groups = [...groups, newGroup];
  return newGroup;
}

export async function mockUpdateGroup(
  id: number,
  data: UpdateGroupRequest,
): Promise<ElectionGroup | null> {
  await simulateDelay(300);

  const index = groups.findIndex((g) => g.id === id);
  if (index === -1) return null;

  const updated: ElectionGroup = {
    ...groups[index],
    ...data,
    updatedAt: now(),
  };

  groups = [...groups.slice(0, index), updated, ...groups.slice(index + 1)];
  return updated;
}

export async function mockDeleteGroup(id: number): Promise<boolean> {
  await simulateDelay(300);

  const index = groups.findIndex((g) => g.id === id);
  if (index === -1) return false;

  // Check if group has elections
  if (groups[index].elections.length > 0) {
    throw new Error(
      "Cannot delete group with elections. Move elections first.",
    );
  }

  groups = [...groups.slice(0, index), ...groups.slice(index + 1)];
  return true;
}

export async function mockMoveElectionToGroup(
  request: MoveElectionToGroupRequest,
): Promise<boolean> {
  await simulateDelay(300);

  const { electionId, targetGroupId } = request;

  // Remove election from any existing group
  groups = groups.map((group) => ({
    ...group,
    elections: group.elections.filter((e) => e.id !== electionId),
    updatedAt: now(),
  }));

  // Add to target group if specified
  if (targetGroupId !== null) {
    const targetIndex = groups.findIndex((g) => g.id === targetGroupId);
    if (targetIndex === -1) return false;

    // Mock election data
    const mockElection = {
      id: electionId,
      name: `Election ${electionId}`,
      location: "Location",
      stage: "created" as const,
      electionDate: groups[targetIndex].electionDate,
    };

    groups[targetIndex] = {
      ...groups[targetIndex],
      elections: [...groups[targetIndex].elections, mockElection],
      updatedAt: now(),
    };
  }

  return true;
}

export async function mockBulkEditElections(
  request: BulkEditRequest,
): Promise<{ success: number; failed: number }> {
  await simulateDelay(600);

  console.log(
    `Mock bulk edit: field=${request.field}, value=${request.value}, elections=${request.electionIds.join(",")}`,
  );

  // In real implementation, this would update multiple elections
  return {
    success: request.electionIds.length,
    failed: 0,
  };
}

export async function mockDuplicateGroup(
  id: number,
): Promise<ElectionGroup | null> {
  await simulateDelay(500);

  const original = groups.find((g) => g.id === id);
  if (!original) return null;

  const duplicate: ElectionGroup = {
    ...original,
    id: generateNumericId(),
    name: `${original.name} (Copy)`,
    elections: [], // Don't copy elections
    createdAt: now(),
    updatedAt: now(),
  };

  groups = [...groups, duplicate];
  return duplicate;
}
