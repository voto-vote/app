"use server";

import { db } from "@/db/drizzle";
import { elections, instances, statementTranslations } from "@/db/schema";
import { Election, Intro, Sponsor, Status } from "@/types/election";
import { eq, and } from "drizzle-orm";

export async function getElection(id: string): Promise<Election> {
  const availableLanguagesData = db
    .selectDistinct({ languageCode: statementTranslations.languageCode })
    .from(statementTranslations)
    .where(eq(statementTranslations.instanceId, parseInt(id)));

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
    .leftJoin(elections, eq(instances.electionId, elections.id))
    .where(and(eq(elections.status, 2), eq(instances.id, parseInt(id))));

  const configurationPromise = fetch(
    `https://votoprod.appspot.com.storage.googleapis.com/configuration/${id}/configuration.json`
  ).then((r) => r.json());

  // TODO remove just for testing purposes
  const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000));

  const [availableLanguages, instance, configuration] = await Promise.all([
    availableLanguagesData,
    instanceData,
    configurationPromise,
    delayPromise, // Simulate delay for testing
  ]);

  const i = instance[0];
  const election: Election = {
    id: i.id,
    electionDate: i.electionDate ?? "1970-01-01",
    title: i.title,
    subtitle: i.subtitle,
    image: configuration?.introduction?.background ?? "",
    locales: availableLanguages.map((l) => l.languageCode),
    defaultLocale: "de", //TODO
    description: i.description,
    sponsors: convertSponsors(configuration),
    launchDate: i.launchDate,
    status: convertStatus(i.status),
    private: false, //TODO
    intro: convertIntro(configuration),
    matchFields: [], //TODO
    algorithm: {
      decisions: 5,
      matchType: "candidates-and-parties",
      weightedVotesLimit: 3,
      matrix: [],
    }, //TODO
    survey: { beforeTheses: false, afterTheses: false }, //TODO
    theming: {
      logo: "/logo-white.svg",
      primary: "oklch(44.7038% 0.24 331,12)",
    }, //TODO
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
      return "created";
    case 2:
      return "created";
    case 4:
      return "created";
    default:
    case 5:
      return "created";
  }
}

function convertSponsors(sponsors: unknown): Sponsor[] {
  if (!Array.isArray(sponsors)) return [];
  return sponsors.map((s) => ({
    name: s.name,
    url: s.href,
    image: s.image,
  }));
}

function convertIntro(intro: unknown): Intro[] {
  if (!Array.isArray(intro)) return [];
  return []; //TODO
}
