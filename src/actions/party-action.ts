"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { parties, partyVotes } from "@/db/schema";
import { Parties, Status } from "@/types/party";

export async function getVotedParties(instanceId: number): Promise<Parties> {
  const partyPromise = db
    .select()
    .from(parties)
    .where(
      and(
        eq(parties.instanceId, instanceId),
        eq(parties.status, 2) // 2 corresponds to "voted" status
      )
    );

  const partyVotesPromise = db
    .select({
      partyId: partyVotes.partyId,
      statementId: partyVotes.statementId,
      value: partyVotes.value,
      explanation: partyVotes.explanation,
    })
    .from(partyVotes)
    .innerJoin(parties, eq(partyVotes.partyId, parties.id))
    .where(and(eq(parties.instanceId, instanceId), eq(parties.status, 2)));

  const [partyResult, partyVotesResult] = await Promise.all([
    partyPromise,
    partyVotesPromise,
  ]);

  return partyResult.map((party) => ({
    id: party.id,
    parentPartyId: party.parentPartyId,
    instanceId: party.instanceId,
    shortName: party.shortName,
    detailedName: party.detailedName,
    description: party.description,
    website: party.website,
    status: getStatusFromNumber(party.status),
    ratings: partyVotesResult
      .filter((vote) => vote.partyId === party.id)
      .map((vote) => ({
        thesisId: String(vote.statementId),
        rating: vote.value,
        explanation: vote.explanation,
      })),
    color: party.color,
    createdAt: party.createdAt,
    updatedAt: party.updatedAt,
  }));
}

function getStatusFromNumber(statusNum: number): Status {
  const statusMap: Record<number, Status> = {
    0: "created",
    1: "active",
    2: "voted",
    3: "deactivated",
  };

  return statusMap[statusNum] || "created";
}
