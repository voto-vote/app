"use server";

import { db } from "@/db/drizzle";
import { candidates, candidateVotes, parties, partyVotes } from "@/db/schema";
import { Ratings } from "@/types/ratings";
import { eq, and } from "drizzle-orm";

type ParticipantRating = {
  [participantId: string]: Ratings;
};

export async function getParticipantRatings(
  instanceId: string
): Promise<ParticipantRating> {
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
      and(
        eq(candidates.instanceId, parseInt(instanceId)),
        eq(candidates.status, 3)
      )
    );

  const partyVotesPromise = db
    .select({
      id: partyVotes.id,
      instanceId: partyVotes.instanceId,
      statementId: partyVotes.statementId,
      partyId: partyVotes.partyId,
      value: partyVotes.value,
      explanation: partyVotes.explanation,
    })
    .from(partyVotes)
    .innerJoin(parties, eq(partyVotes.partyId, parties.id))
    .where(
      and(eq(parties.instanceId, parseInt(instanceId)), eq(parties.status, 2))
    );

  const [candidateVotesResult, partyVotesResult] = await Promise.all([
    candidateVotesPromise,
    partyVotesPromise,
  ]);

  const ratings: ParticipantRating = {};

  return ratings;
}
