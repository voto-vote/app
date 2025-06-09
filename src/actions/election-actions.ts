"use server";

import { type Election, ElectionSchema } from "@/schemas/election";
import {
  type ElectionSummary,
  ElectionSummarySchema,
} from "@/schemas/election-summary";
import { Thesis, ThesisSchema } from "@/schemas/thesis";
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

export async function fetchElection(id: string): Promise<Election> {
  // Because the elections can change, do not prerender this function
  await connection();

  const apiBaseUrl =
    process.env.VOTO_APP_API_BASE_URL || "https://api.voto.vote/v2";

  const res = await fetch(`${apiBaseUrl}/elections/${id}`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch elections: ${res.status}`);
  }

  const data = await res.json();

  const result = await ElectionSchema.safeParseAsync(data);

  if (result.success) {
    return result.data;
  } else {
    console.error(
      "Election API response validation failed:",
      result.error.message
    );
    throw new Error(
      `Invalid Election API response format: ${result.error.message}`
    );
  }
}

export async function fetchTheses(
  id: string,
  locale: string
): Promise<Thesis[]> {
  // Because the theses can change, do not prerender this function
  await connection();

  const apiBaseUrl =
    process.env.VOTO_APP_API_BASE_URL || "https://api.voto.vote/v2";

  const res = await fetch(
    `${apiBaseUrl}/elections/${id}/theses?locale=${locale}`,
    {
      cache: "force-cache",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch theses: ${res.status}`);
  }

  const data = await res.json();

  const result = await ThesisSchema.array().safeParseAsync(data);

  if (result.success) {
    return result.data;
  } else {
    console.error(
      "Theses API response validation failed:",
      result.error.message
    );
    throw new Error(
      `Invalid Theses API response format: ${result.error.message}`
    );
  }
}
