"use server";

import { type Election, ElectionSchema } from "@/schemas/election";
import { connection } from "next/server";

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
