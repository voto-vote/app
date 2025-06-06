import z from "zod";

export const ElectionSummarySchema = z.object({
  id: z.string(),
  date: z.string().date(),
  title: z.string(),
  subtitle: z.string(),
  image: z.string().url(),
});
export type ElectionSummary = z.infer<typeof ElectionSummarySchema>;
