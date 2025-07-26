"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { candidates, parties } from "@/db/schema";
import { Candidate, Status } from "@/types/candidate";

export async function getCandidatesByInstanceAndStatus(instanceId: number): Promise<Candidate[]> {
  const result = await db
    .select({
      // Candidate fields
      id: candidates.id,
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
    .innerJoin(parties, eq(candidates.partyId, parties.id))
    .where(
      and(
        eq(candidates.instanceId, instanceId),
        eq(candidates.status, 3) // 3 corresponds to "voted" status
      )
    );

  // Transform the database result to match your Candidate type + color
  return result.map(candidate => ({
    id: candidate.id,
    instanceId: candidate.instanceId,
    userId: candidate.userId,
    partyId: candidate.partyId,
    description: candidate.description,
    district: candidate.district,
    launchDate: "", // Note: launchDate is not in your schema but in your type
    listPlace: candidate.listPlace,
    website: candidate.website,
    status: getStatusFromNumber(candidate.status),
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
    3: "deactivated"
  };
  
  return statusMap[statusNum] || "created";
}
