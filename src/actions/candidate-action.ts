"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { candidates, parties, candidateVotes, users } from "@/db/schema";
import { Candidates, Status } from "@/types/candidate";

export async function getVotedCandidates(
  instanceId: number
): Promise<Candidates> {
  const candidatesPromise = db
    .select({
      // Candidate fields
      id: candidates.id,
      title: users.title,
      firstName: users.firstName,
      lastName: users.lastName,
      instanceId: candidates.instanceId,
      userId: candidates.userId,
      partyId: candidates.partyId,
      description: candidates.description,
      district: candidates.district,
      listPlace: candidates.listPlace,
      website: candidates.website,
      status: candidates.status,
      createdAt: candidates.createdAt,
      updatedAt: candidates.updatedAt,
      // Party color from join
      color: parties.color,
    })
    .from(candidates)
    .innerJoin(users, eq(candidates.userId, users.id))
    .innerJoin(parties, eq(candidates.partyId, parties.id))
    .where(
      and(
        eq(candidates.instanceId, instanceId),
        eq(candidates.status, 3) // 3 corresponds to "voted" status
      )
    );

  const candidateVotesPromise = db
    .select({
      id: candidateVotes.candidateId,
      instanceId: candidateVotes.instanceId,
      statementId: candidateVotes.statementId,
      candidateId: candidateVotes.candidateId,
      value: candidateVotes.value,
      explanation: candidateVotes.explanation,
    })
    .from(candidateVotes)
    .innerJoin(candidates, eq(candidateVotes.candidateId, candidates.id))
    .where(
      and(eq(candidates.instanceId, instanceId), eq(candidates.status, 3))
    );

  const [candidatesResult, candidateVotesResult] = await Promise.all([
    candidatesPromise,
    candidateVotesPromise,
  ]);

  // Transform the database result to match your Candidate type + color
  return candidatesResult.map((candidate) => ({
    id: candidate.id,
    title: candidate.title,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    instanceId: candidate.instanceId,
    userId: candidate.userId,
    partyId: candidate.partyId,
    description: candidate.description,
    district: candidate.district,
    launchDate: "", // Note: launchDate is not in your schema but in your type
    listPlace: candidate.listPlace,
    website: candidate.website,
    status: getStatusFromNumber(candidate.status),
    ratings: candidateVotesResult
      .filter((vote) => vote.candidateId === candidate.id)
      .map((vote) => ({
        thesisId: String(vote.statementId),
        rating: vote.value,
        explanation: vote.explanation,
      })),
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
    color: candidate.color,
  }));
}

// Helper function to convert status number to Status type
function getStatusFromNumber(statusNum: number): Status {
  const statusMap: Record<number, Status> = {
    0: "created",
    1: "active",
    2: "voted",
    3: "deactivated",
  };

  return statusMap[statusNum] || "created";
}
