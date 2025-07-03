"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { statements, statementTranslations } from "@/db/schema";
import { These } from "@/types/theses";

export async function getTheses(
  applicationId: number,
  locale: string,
): Promise<These[]> {
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
      eq(statements.instanceId, applicationId),
    )
  );

  // Transform the result into the desired format
    const theses: These[] = result.map((row) => ({
        id: row.statementId.toString(),
        category: row.title.toString(),
        text: row.text,
        explanations: [], 
        additionalInfos: "",
    }));
  return theses;
}