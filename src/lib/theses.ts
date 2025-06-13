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
    return shuffle(result.data);
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

function shuffle<T>(array: Array<T>): Array<T> {
  let currentIndex = array.length;
  const newArray = [...array];

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
}
