import z from "zod";

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
export const ElectionSchema = z.object({
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
