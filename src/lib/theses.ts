"use server";

import { Thesis, ThesisSchema } from "@/schemas/thesis";
import { connection } from "next/server";

export async function fetchTheses(
  id: string,
  locale: string
): Promise<Thesis[]> {
  // Because the theses can change, do not prerender this function
  await connection();

  const apiBaseUrl =
    process.env.VOTO_APP_API_BASE_URL || "https://api.voto.vote";

  const res = await fetch(
    `${apiBaseUrl}/applications/${id}/theses?locale=${locale}`,
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
