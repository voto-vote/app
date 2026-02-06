"use server";

import type {
  ChangeRequest,
  CreateChangeRequestRequest,
  ReviewChangeRequestRequest,
  ChangeRequestStatus,
} from "@/types/admin";
import { simulateDelay, generateId, now } from "@/lib/admin/mock-utils";
import { mockChangeRequests, mockUsers } from "@/lib/admin/mock-data";

// In-memory store
let changeRequests = [...mockChangeRequests];

export async function mockGetChangeRequests(
  electionId: number,
  status?: ChangeRequestStatus,
): Promise<ChangeRequest[]> {
  await simulateDelay(300);

  let results = changeRequests.filter((cr) => cr.electionId === electionId);
  if (status) {
    results = results.filter((cr) => cr.status === status);
  }

  return results;
}

export async function mockGetChangeRequest(
  id: string,
): Promise<ChangeRequest | null> {
  await simulateDelay(200);
  return changeRequests.find((cr) => cr.id === id) || null;
}

export async function mockCreateChangeRequest(
  data: CreateChangeRequestRequest,
): Promise<ChangeRequest> {
  await simulateDelay(400);

  // Get requester name
  const requester = mockUsers.find((u) => u.id === data.requestedBy);

  const newRequest: ChangeRequest = {
    ...data,
    id: generateId(),
    requestedByName: requester
      ? `${requester.firstName} ${requester.lastName}`
      : "Unknown",
    status: "pending",
    createdAt: now(),
  };

  changeRequests = [...changeRequests, newRequest];
  return newRequest;
}

export async function mockReviewChangeRequest(
  id: string,
  review: ReviewChangeRequestRequest,
): Promise<ChangeRequest | null> {
  await simulateDelay(500);

  const index = changeRequests.findIndex((cr) => cr.id === id);
  if (index === -1) return null;

  const updated: ChangeRequest = {
    ...changeRequests[index],
    status: review.status,
    reviewedBy: 1, // Mock current user
    reviewedAt: now(),
    reviewNotes: review.reviewNotes,
  };

  changeRequests = [
    ...changeRequests.slice(0, index),
    updated,
    ...changeRequests.slice(index + 1),
  ];
  return updated;
}

export async function mockGetPendingChangeRequestsCount(
  electionId: number,
): Promise<number> {
  await simulateDelay(100);
  return changeRequests.filter(
    (cr) => cr.electionId === electionId && cr.status === "pending",
  ).length;
}

export async function mockDeleteChangeRequest(id: string): Promise<boolean> {
  await simulateDelay(200);

  const index = changeRequests.findIndex((cr) => cr.id === id);
  if (index === -1) return false;

  // Only allow deleting pending requests
  if (changeRequests[index].status !== "pending") {
    throw new Error("Can only delete pending change requests");
  }

  changeRequests = [
    ...changeRequests.slice(0, index),
    ...changeRequests.slice(index + 1),
  ];
  return true;
}
