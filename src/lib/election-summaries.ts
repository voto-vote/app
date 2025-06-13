"use server";

import {
  ElectionSummary,
  ElectionSummarySchema,
} from "@/schemas/election-summary";
import { connection } from "next/server";

export async function fetchElectionSummaries(): Promise<ElectionSummary[]> {
  // Because the elections can change, do not prerender this function
  await connection();

  const apiBaseUrl =
    process.env.VOTO_APP_API_BASE_URL || "https://api.voto.vote/v2";

  const res = await fetch(`${apiBaseUrl}/elections`, { cache: "force-cache" });

  if (!res.ok) {
    throw new Error(`Failed to fetch elections: ${res.status}`);
  }

  const data = await res.json();

  const result = await ElectionSummarySchema.array().safeParseAsync(data);

  if (result.success) {
    return result.data;
  } else {
    console.error(
      "Election Summaries API response validation failed:",
      result.error.message
    );
    throw new Error(
      `Invalid Election Summaries API response format: ${result.error.message}`
    );
  }
}
