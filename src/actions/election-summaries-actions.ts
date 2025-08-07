"use server";

import { eq, desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { elections, instances } from "@/db/schema";
import { ElectionSummary } from "@/types/election-summary";

export async function getElectionSummaries(
  limit: number = 100,
  offset: number = 0
): Promise<ElectionSummary[]> {
  const objectStorageUrl = process.env.OBJECT_STORAGE_URL;
  if (!objectStorageUrl) {
    throw new Error(
      "OBJECT_STORAGE_URL is not defined in the environment variables."
    );
  }

  const instance = await db
    .select({
      id: instances.id,
      electionDate: elections.electionDate,
      title: instances.title,
      subtitle: instances.subtitle,
    })
    .from(instances)
    .innerJoin(elections, eq(instances.electionId, elections.id))
    .where(eq(elections.status, 2))
    .orderBy(desc(elections.electionDate))
    .offset(offset)
    .limit(limit);

  const electionSummaries: ElectionSummary[] = (
    await Promise.all(
      instance.map(async (i) => {
        try {
          const configurationUrl =
            objectStorageUrl +
            "/configuration/" +
            i.id.toString() +
            "/configuration.json";
          const configurationUrlOrigin = new URL(configurationUrl).origin;
          const response = await fetch(configurationUrl);
          const config = await response.json();

          return {
            ...i,
            electionDate: new Date(i.electionDate ?? "1970-01-01"),
            image: config?.introduction?.background?.replace(
              "voto://",
              configurationUrlOrigin + "/"
            ),
          };
        } catch (error) {
          // Ignore elections where configuration is not found or JSON is invalid
          console.warn(`Skipping election instance ${i.id}: ` + error);
          return null;
        }
      })
    )
  ).filter((d) => d !== null);

  return electionSummaries;
}
