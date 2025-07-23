"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { statements, statementTranslations } from "@/db/schema";
import { Theses, Thesis } from "@/types/theses";

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
  const theses: Theses = result.map((row) => {
    const { text, explanations } = parseThesisText(
      row.text,
      "titleTODO",
      "locationTODO"
    );
    return {
      id: row.statementId.toString(),
      category: row.title.toString(),
      text,
      explanations,
      additionalInfos: "", //TODO
    };
  });

  return theses;
}

export function parseThesisText(
  text: string,
  electionTitle: string,
  electionLocation: string
): Pick<Thesis, "text" | "explanations"> {
  text = text
    .replaceAll("{title}", electionTitle)
    .replaceAll("{location}", electionLocation);

  const matches = text.matchAll(/\((.*?)\)\[(.*?)\]/g);
  const explanations: Thesis["explanations"] = [];

  for (const match of matches) {
    if (match[1] && match[2]) {
      // Replace the matched text with the first group (the thesis text)
      text = text.replace(match[0], match[1].trim());
      // Store the explanation with its start and end offsets
      explanations.push({
        text: match[2].trim(),
        startOffset: match.index,
        endOffset: match.index + match[1].trim().length,
      });
    }
  }

  return { text, explanations };
}
