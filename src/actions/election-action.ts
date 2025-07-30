"use server";

import { db } from "@/db/drizzle";
import {
  elections,
  instances,
  statements,
  statementTranslations,
} from "@/db/schema";
import { Election, Status } from "@/types/election";
import { eq, count } from "drizzle-orm";
import { getTranslations } from "next-intl/server";

export async function getElection(id: string): Promise<Election | null> {
  const objectStorageUrl = process.env.OBJECT_STORAGE_URL;
  if (!objectStorageUrl) {
    throw new Error(
      "OBJECT_STORAGE_URL is not defined in the environment variables."
    );
  }

  const availableLanguagesData = db
    .selectDistinct({ languageCode: statementTranslations.languageCode })
    .from(statementTranslations)
    .where(eq(statementTranslations.instanceId, parseInt(id)));

  const numberOfThesesData = db
    .select({ count: count() })
    .from(statements)
    .where(eq(statements.instanceId, parseInt(id)));

  const instanceData = db
    .select({
      id: instances.id,
      electionDate: elections.electionDate,
      title: instances.title,
      subtitle: instances.subtitle,
      description: instances.description,
      launchDate: instances.launchDate,
      status: instances.status,
    })
    .from(instances)
    .innerJoin(elections, eq(instances.electionId, elections.id))
    .where(eq(instances.id, parseInt(id)));

  const configurationUrl = objectStorageUrl + "/configuration/" + id + "/configuration.json";
  const configurationUrlOrigin = new URL(configurationUrl).origin;
  const configurationPromise = fetch(configurationUrl).then((r) => r.json());

  let availableLanguages, numberOfTheses, instance, configuration;
  try {
    [availableLanguages, numberOfTheses, instance, configuration] =
      await Promise.all([
        availableLanguagesData,
        numberOfThesesData,
        instanceData,
        configurationPromise,
      ]);
  } catch (error) {
    return null; // Election not found
  }

  const i = instance[0];
  if (!i) {
    return null; // Election not found
  }
  const locales = availableLanguages.map((l) => l.languageCode);
  if (locales.length === 0) {
    locales.push("de");
  }
  const election: Election = {
    id: i.id,
    electionDate: i.electionDate ?? "1970-01-01",
    title: i.title,
    subtitle: i.subtitle,
    image:
      configuration?.introduction?.background?.replace(
        "voto://",
        configurationUrlOrigin + "/"
      ) ?? "",
    locales: locales,
    description: await convertDescription(
      i.description,
      configuration?.sponsors ?? [],
      configurationUrlOrigin
    ),
    launchDate: i.launchDate,
    status: convertStatus(i.status),
    private: false, //TODO
    matchFields: [], //TODO
    algorithm: {
      decisions: configuration?.algorithm?.decisions ?? 5,
      matchType: convertMatchType(configuration?.algorithm?.matchType ?? 2),
      weightedVotesLimit: configuration?.algorithm?.limitWeightedVotes
        ? numberOfTheses[0].count *
          (configuration?.algorithm?.limitFactor ?? 0.2)
        : false,
      matrix: configuration?.algorithm?.matrix ?? [],
    },
    survey: convertSurvey(configuration),
    theming: {
      logo: configuration?.theming?.logo ?? "/logo-white.svg",
      primary: configuration?.theming?.primary ?? "oklch(44.7038% 0.24 331.12)",
    },
    faqs: [], //TODO
    disableLiveVotes: false, //TODO
  };

  return election;
}

function convertStatus(status: number): Status {
  switch (status) {
    case 0:
      return "created";
    case 1:
      return "in-preparation";
    case 2:
      return "ready-to-launch";
    case 3:
      return "live";
    default:
    case 4:
    case 5:
      return "deactivated";
  }
}

async function convertDescription(
  description: string,
  sponsors: unknown,
  configurationUrlOrigin: string
): Promise<string> {
  const s = (Array.isArray(sponsors) ? sponsors : []).map((s) => ({
    name: s.name,
    url: s.href,
    image: s.image,
  }));

  const t = await getTranslations();

  let result = `# ${t("Election.informationsTitle")}\n\n${description}`;

  if (s.length > 0) {
    result += `\n\n## ${t("Election.sponsorsTitle")}\n\n${s
      .map(
        (sponsor) =>
          `## [${sponsor.name}](<${sponsor.url}>) ![${sponsor.name}](<${sponsor.image.replace(
            "voto://",
            configurationUrlOrigin + "/"
          )}>)`
      )
      .join("\n")}`;
  }

  return result;
}

function convertMatchType(
  matchType: number
): Election["algorithm"]["matchType"] {
  switch (matchType) {
    case 0:
      return "candidates";
    case 1:
      return "parties";
    case 2:
    default:
      return "candidates-and-parties";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertSurvey(configuration: any): Election["survey"] {
  return {
    beforeTheses: configuration.presurvey?.enabled
      ? configuration.presurvey
      : false,
    afterTheses: configuration.survey?.enabled ? configuration.survey : false,
  };
}
