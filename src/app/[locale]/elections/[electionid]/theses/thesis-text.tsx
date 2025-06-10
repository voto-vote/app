"use client";

import Markdown from "@/components/markdown";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Thesis } from "@/schemas/thesis";

export default function ThesisText({ thesis }: { thesis: Thesis }) {
  // Sort explanations by startOffset
  const explanations =
    thesis.explanations?.sort((a, b) => a.startOffset - b.startOffset) ?? [];

  // Check explanations for overlapping or overflowing segments
  let lastEndOffset = 0;
  const textLength = thesis.text.length;
  for (const explanation of explanations) {
    // Ensure startOffset is not before lastEndOffset and within text bounds
    explanation.startOffset = clamp(
      Math.max(explanation.startOffset, lastEndOffset),
      0,
      textLength
    );
    // Ensure endOffset is not before startOffset and within text bounds
    explanation.endOffset = clamp(
      Math.max(explanation.endOffset, explanation.startOffset),
      0,
      textLength
    );
    lastEndOffset = explanation.endOffset;
  }

  const segments: { text: string; explanation?: string }[] = [];
  let lastEnd = 0;
  for (const explanation of explanations) {
    if (explanation.startOffset > lastEnd) {
      segments.push({
        text: thesis.text.slice(lastEnd, explanation.startOffset),
        explanation: undefined,
      });
    }
    segments.push({
      text: thesis.text.slice(explanation.startOffset, explanation.endOffset),
      explanation: explanation.text,
    });
    lastEnd = explanation.endOffset;
  }
  if (lastEnd < textLength) {
    segments.push({
      text: thesis.text.slice(lastEnd, textLength),
      explanation: undefined,
    });
  }

  return (
    <p className="text-2xl font-bold">
      {segments.map((segment, index) => {
        if (!segment.explanation) {
          return <span key={index}>{segment.text}</span>;
        }

        return (
          <Popover key={index}>
            <PopoverTrigger asChild>
              <span className="underline decoration-3 decoration-primary decoration-dashed cursor-pointer">
                {segment.text}
              </span>
            </PopoverTrigger>
            <PopoverContent
              className="bg-primary py-1 px-2 border-primary"
              side="top"
            >
              <Markdown
                content={segment.explanation}
                className="prose-sm bg-primary text-primary-foreground"
              ></Markdown>
            </PopoverContent>
          </Popover>
        );
      })}
    </p>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
