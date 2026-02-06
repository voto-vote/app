"use server";

import type { AIGrammarSuggestion, TextChange } from "@/types/admin";
import { simulateDelay } from "@/lib/admin/mock-utils";

export async function mockCheckGrammar(
  text: string,
): Promise<AIGrammarSuggestion> {
  // Simulate AI processing time
  await simulateDelay(1000);

  const changes: TextChange[] = [];
  let suggestion = text;
  let hasDoubleNegation = false;
  let doubleNegationDetails: string | undefined;

  // Simple mock grammar corrections

  // 1. Double negation detection (German)
  const doubleNegationPatterns = [
    /nicht\s+nicht/gi,
    /kein\s+nicht/gi,
    /nicht\s+kein/gi,
    /niemals\s+nicht/gi,
  ];

  for (const pattern of doubleNegationPatterns) {
    if (pattern.test(text)) {
      hasDoubleNegation = true;
      doubleNegationDetails = `Doppelte Verneinung gefunden: "${text.match(pattern)?.[0]}"`;
      break;
    }
  }

  // 2. Common spelling corrections (German)
  const corrections: [RegExp, string][] = [
    [/\bwichtig\b/gi, "wichtig"],
    [/\bwiederspruch\b/gi, "Widerspruch"],
    [/\bstandart\b/gi, "Standard"],
    [/\bvorraussetzung\b/gi, "Voraussetzung"],
    [/\bseperat\b/gi, "separat"],
    [/\bwarscheinlich\b/gi, "wahrscheinlich"],
    [/\bwiederum\b/gi, "wiederum"],
    [/\bausserdem\b/gi, "außerdem"],
  ];

  for (const [pattern, replacement] of corrections) {
    const match = text.match(pattern);
    if (match && match[0].toLowerCase() !== replacement.toLowerCase()) {
      const startOffset = text.indexOf(match[0]);
      changes.push({
        type: "modification",
        startOffset,
        endOffset: startOffset + match[0].length,
        originalText: match[0],
        suggestedText: replacement,
      });
      suggestion = suggestion.replace(pattern, replacement);
    }
  }

  // 3. Punctuation fixes
  if (!/[.!?]$/.test(text.trim())) {
    changes.push({
      type: "addition",
      startOffset: text.length,
      endOffset: text.length,
      originalText: "",
      suggestedText: ".",
    });
    suggestion = suggestion.trim() + ".";
  }

  // 4. Capitalization fixes (German: nouns should be capitalized)
  const commonNouns = [
    "gemeinde",
    "stadt",
    "bürger",
    "fahrradwege",
    "schule",
    "kindergarten",
  ];
  for (const noun of commonNouns) {
    const regex = new RegExp(`\\b${noun}\\b`, "g");
    const capitalized = noun.charAt(0).toUpperCase() + noun.slice(1);
    if (regex.test(suggestion)) {
      const match = suggestion.match(regex);
      if (match) {
        const startOffset = suggestion.indexOf(match[0]);
        changes.push({
          type: "modification",
          startOffset,
          endOffset: startOffset + match[0].length,
          originalText: match[0],
          suggestedText: capitalized,
        });
        suggestion = suggestion.replace(regex, capitalized);
      }
    }
  }

  return {
    original: text,
    suggestion,
    changes,
    hasDoubleNegation,
    doubleNegationDetails,
  };
}

export async function mockAutoTranslate(
  text: string,
  fromLang: string,
  toLang: string,
): Promise<string> {
  // Simulate translation processing time
  await simulateDelay(800);

  // Mock translation - in reality this would call a translation API
  console.log(`Mock translate from ${fromLang} to ${toLang}: ${text}`);

  // For demo purposes, add a prefix to show it's "translated"
  const langPrefix: Record<string, string> = {
    en: "[EN]",
    de: "[DE]",
    fr: "[FR]",
    es: "[ES]",
    it: "[IT]",
  };

  return `${langPrefix[toLang] || `[${toLang.toUpperCase()}]`} ${text}`;
}

export async function mockApproveTranslation(
  thesisId: string,
  languageCode: string,
): Promise<boolean> {
  await simulateDelay(300);
  console.log(
    `Mock approve translation: thesisId=${thesisId}, lang=${languageCode}`,
  );
  return true;
}

export async function mockRejectTranslation(
  thesisId: string,
  languageCode: string,
  reason?: string,
): Promise<boolean> {
  await simulateDelay(300);
  console.log(
    `Mock reject translation: thesisId=${thesisId}, lang=${languageCode}, reason=${reason}`,
  );
  return true;
}
