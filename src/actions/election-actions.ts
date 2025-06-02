"use server";

import { connection } from "next/server";
import { z } from "zod";

const ElectionSummarySchema = z.object({
  id: z.string(),
  date: z.string().date(),
  title: z.string(),
  subtitle: z.string(),
  image: z.string().url(),
});
export type ElectionSummary = z.infer<typeof ElectionSummarySchema>;
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
    console.error("API response validation failed:", result.error.errors);
    throw new Error(`Invalid API response format: ${result.error.message}`);
  }
}

const ElectionSurveySchema = z.union([
  z.object({
    enabled: z.literal(false),
  }),
  z.object({
    enabled: z.literal(true),
    endpoint: z.string().url(),
    frequency: z.number(),
    title: z.string(),
    description: z.string(),
    yes: z.string(),
    no: z.string(),
  }),
]);
const ElectionSchema = z.object({
  id: z.string(),
  date: z.string().date(),
  title: z.string(),
  subtitle: z.string(),
  image: z.string().url(),
  locales: z.string().array(),
  defaultLocale: z.string(),
  description: z.string(),
  sponsors: z.array(
    z.object({
      name: z.string(),
      url: z.string().url(),
      image: z.string().url(),
    })
  ),
  launchDate: z.string().date(),
  status: z.enum([
    "created",
    "in-progress",
    "ready-to-launch",
    "live",
    "deactivated",
  ]),
  private: z.boolean(),
  intro: z.array(
    z.object({
      image: z.string().url(),
      title: z.string(),
      description: z.string(),
    })
  ),
  matchFields: z.array(
    z.object({
      type: z.enum(["district", "description", "list", "website"]),
      value: z.string(),
      required: z.boolean(),
      show: z.boolean(),
    })
  ),
  algorithm: z.object({
    decisions: z.number(),
    matchType: z.enum(["candidates", "parties", "candidates-and-parties"]),
    weightedVotesLimit: z.number(),
    matrix: z.number().array().array(),
  }),
  survey: z.object({
    beforeTheses: ElectionSurveySchema,
    afterTheses: ElectionSurveySchema,
  }),
  theming: z.object({
    logo: z.string().url(),
    primary: z.string(),
  }),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
  disableLiveVotes: z.boolean(),
});
export type Election = z.infer<typeof ElectionSchema>;
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
    console.error("API response validation failed:", result.error.errors);
    throw new Error(`Invalid API response format: ${result.error.message}`);
  }
}
