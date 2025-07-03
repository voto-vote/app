"use server";

import { eq, desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { elections, instances } from "@/db/schema";
import { ElectionSummary } from "@/types/election-summary";

export async function getElectionSummaries(
  limit: number = 100,
  offset: number = 0
): Promise<ElectionSummary[]> {
  const instance = await db
    .select({
      id: instances.id,
      electionDate: elections.electionDate,
      title: instances.title,
      subtitle: instances.subtitle,
    })
    .from(instances)
    .leftJoin(elections, eq(instances.electionId, elections.id))
    .where(eq(elections.status, 2))
    .orderBy(desc(elections.electionDate))
    .offset(offset)
    .limit(limit);

  const electionSummaries: ElectionSummary[] = (
    await Promise.allSettled(
      instance.map(async (d) => {
        try {
          const response = await fetch(
            `https://votoprod.appspot.com.storage.googleapis.com/configuration/${d.id}/configuration.json`
          );

          const text = await response.text();
          const config = JSON.parse(text);

          return {
            ...d,
            electionDate: d.electionDate ?? "1970-01-01",
            image:
              config?.introduction?.background?.replace(
                "voto://",
                "https://votoprod.appspot.com.storage.googleapis.com/"
              ) ?? "",
          };
        } catch (error) {
          // Ignore elections where configuration is not found or JSON is invalid
          return null;
        }
      })
    )
  )
    .filter((result): result is PromiseFulfilledResult<ElectionSummary> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);

  return electionSummaries;
}