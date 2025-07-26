"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { parties } from "@/db/schema";
import { Party, Status } from "@/types/party";

export async function getPartiesForInstance(
  instanceId: number,
): Promise<Party[]> {
  const result = await db
    .select()
    .from(parties)
    .where(
      and(
        eq(parties.instanceId, instanceId),
        eq(parties.status, 3) // 3 corresponds to "voted" status
      )
    );

  // Transform the database result to match your Party type
  return result.map(party => ({
    id: party.id,
    parentPartyId: party.parentPartyId,
    instanceId: party.instanceId,
    shortName: party.shortName,
    detailedName: party.detailedName,
    description: party.description,
    website: party.website,
    status: getStatusFromNumber(party.status),
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
    3: "deactivated"
  };
  
  return statusMap[statusNum] || "created";
}
