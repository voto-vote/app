import { z } from "zod";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.voto.vote/v2";

export const ElectionSchema = z.object({
  id: z.string(),
  date: z.string().date(),
  title: z.string(),
  subtitle: z.string(),
  image: z.string().url(),
});
export type Election = z.infer<typeof ElectionSchema>;
export async function getElections(): Promise<Election[]> {
  const res = await fetch(`${apiBaseUrl}/elections`);

  if (!res.ok) {
    throw new Error(`Failed to fetch elections: ${res.status}`);
  }

  const data = await res.json();

  const result = await ElectionSchema.array().safeParseAsync(data);

  if (result.success) {
    return result.data;
  } else {
    console.error("API response validation failed:", result.error.errors);
    throw new Error(`Invalid API response format: ${result.error.message}`);
  }
}
