"use client";

import { ResponsiveTooltip } from "@/components/responsive-tooltip";
import { type Thesis } from "@/types/theses";
import { Fragment } from "react";

export default function ThesisText({ thesis }: { thesis: Thesis }) {
  // Trim thesis text to avoid spaces at the start and end TODO remove once validated in the backend
  const thesisText = thesis.text.trim();

  // Sort explanations by startOffset
  const explanations =
    thesis.explanations?.sort((a, b) => a.startOffset - b.startOffset) ?? [];

  // Check explanations for overlapping or overflowing segments
  let lastEndOffset = 0;
  const textLength = thesisText.length;
  for (const explanation of explanations) {
    // Ensure startOffset is not before lastEndOffset and within text bounds
    explanation.startOffset = clamp(
      Math.max(explanation.startOffset, lastEndOffset),
      0,
      textLength,
    );
    // Ensure endOffset is not before startOffset and within text bounds
    explanation.endOffset = clamp(
      Math.max(explanation.endOffset, explanation.startOffset),
      0,
      textLength,
    );
    lastEndOffset = explanation.endOffset;
  }

  const segments: { text: string; explanation?: string }[] = [];
  let lastEnd = 0;
  for (const explanation of explanations) {
    if (explanation.startOffset > lastEnd) {
      segments.push({
        text: thesisText.slice(lastEnd, explanation.startOffset),
        explanation: undefined,
      });
    }
    segments.push({
      text: thesisText.slice(explanation.startOffset, explanation.endOffset),
      explanation: explanation.text.trim(),
    });
    lastEnd = explanation.endOffset;
  }
  if (lastEnd < textLength) {
    segments.push({
      text: thesisText.slice(lastEnd, textLength),
      explanation: undefined,
    });
  }

  return (
    <p className="text-xl md:text-2xl font-bold">
      {segments.map((segment, index) => {
        if (!segment.explanation) {
          return (
            <Fragment key={index}>
              <span>{segment.text}</span>
            </Fragment>
          );
        }

        return (
          <ResponsiveTooltip
            key={index}
            trigger={
              <span className="underline decoration-3 decoration-primary decoration-dashed cursor-pointer">
                {segment.text}
              </span>
            }
            className="text-base text-wrap"
          >
            {segment.explanation}
          </ResponsiveTooltip>
        );
      })}
    </p>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
