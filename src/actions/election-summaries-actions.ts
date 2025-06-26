"use server";

import { eq, desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { elections, instances } from "@/db/schema";
import { ElectionSummary } from "@/types/election-summary";
import { unstable_cacheLife as cacheLife } from 'next/cache'
import { unstable_cacheTag as cacheTag } from "next/cache";

export async function getElectionSummaries(limit: number = 100, offset: number = 0): Promise<ElectionSummary[]> {
    "use cache";

    cacheLife("minutes");
    cacheTag("election-summaries")

    const instance = await db.select({
        id: instances.id,
        electionDate: elections.electionDate,
        title: instances.title,
        subtitle: instances.subtitle
    })
        .from(instances)
        .leftJoin(elections, eq(instances.electionId, elections.id))
        .where(eq(elections.status, 2))
        .orderBy(desc(elections.electionDate))
        .offset(offset)
        .limit(limit)

    const electionSummaries: ElectionSummary[] = await Promise.all(
        instance.map(d => {
            return fetch(`https://votoprod.appspot.com.storage.googleapis.com/configuration/${d.id}/configuration.json`)
                .then(r => r.json())
                .then(c => ({
                    ...d,
                    electionDate: d.electionDate ?? "1970-01-01",
                    image: c?.introduction?.background ?? ""
                }
                ))
        })
    )

    return electionSummaries;
};
