import z from "zod";

export const ThesisSchema = z.object({
  id: z.string(),
  category: z.string(),
  text: z.string(),
  explanations: z
    .array(
      z.object({
        startOffset: z.number(),
        endOffset: z.number(),
        text: z.string(),
      })
    )
    .optional(),
  additionalInfos: z.string().optional(),
});
export type Thesis = z.infer<typeof ThesisSchema>;
