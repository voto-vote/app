"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { statements, statementTranslations } from "@/db/schema";
import { Theses } from "@/types/theses";

export async function getTheses(
  instanceId: string,
  locale: string
): Promise<Theses> {
  const result = await db
    .select({
      statementId: statements.id,
      translationId: statementTranslations.id,
      title: statementTranslations.title,
      text: statementTranslations.text,
      createdAt: statementTranslations.createdAt,
      updatedAt: statementTranslations.updatedAt,
    })
    .from(statementTranslations)
    .innerJoin(statements, eq(statementTranslations.statementId, statements.id))
    .where(
      and(
        eq(statementTranslations.languageCode, locale),
        eq(statements.instanceId, Number(instanceId))
      )
    );

  // Transform the result into the desired format
  const theses: Theses = result.map((row) => ({
    id: row.statementId.toString(),
    category: row.title.toString(),
    text: row.text,
    explanations: [], //TODO
    additionalInfos: "", //TODO
  }));

  return theses;
}
