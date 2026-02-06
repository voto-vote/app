"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElectionStage } from "@/types/admin";

type StageSteperProps = {
  currentStage: ElectionStage;
  onStageClick?: (stage: ElectionStage) => void;
  canTransition?: (stage: ElectionStage) => boolean;
};

const stages: { value: ElectionStage; label: string; description: string }[] = [
  {
    value: "created",
    label: "Created",
    description: "Initial setup",
  },
  {
    value: "thesis-entry",
    label: "Thesis Entry",
    description: "Add and edit theses",
  },
  {
    value: "answering",
    label: "Answering",
    description: "Parties & candidates answer",
  },
  {
    value: "live",
    label: "Live",
    description: "Public voting",
  },
  {
    value: "archived",
    label: "Archived",
    description: "Election ended",
  },
];

export function StageStepper({
  currentStage,
  onStageClick,
  canTransition,
}: StageSteperProps) {
  const currentIndex = stages.findIndex((s) => s.value === currentStage);

  return (
    <div className="w-full">
      <nav aria-label="Election Stages">
        <ol className="flex items-center">
          {stages.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isClickable =
              onStageClick && canTransition && canTransition(stage.value);

            return (
              <li
                key={stage.value}
                className={cn(
                  "flex items-center",
                  index < stages.length - 1 && "flex-1",
                )}
              >
                <button
                  type="button"
                  onClick={() => isClickable && onStageClick?.(stage.value)}
                  disabled={!isClickable}
                  className={cn(
                    "group flex flex-col items-center",
                    isClickable && "cursor-pointer",
                    !isClickable && "cursor-default",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                      isCompleted &&
                        "border-primary bg-primary text-primary-foreground",
                      isCurrent && "border-primary bg-background text-primary",
                      !isCompleted &&
                        !isCurrent &&
                        "border-muted-foreground/30 bg-background text-muted-foreground",
                      isClickable && "group-hover:border-primary",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "mt-2 text-sm font-medium",
                      isCurrent && "text-primary",
                      !isCurrent && "text-muted-foreground",
                    )}
                  >
                    {stage.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stage.description}
                  </span>
                </button>

                {/* Connector line */}
                {index < stages.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 flex-1",
                      index < currentIndex ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

// Compact version for smaller spaces
export function StageStepperCompact({
  currentStage,
}: {
  currentStage: ElectionStage;
}) {
  const currentIndex = stages.findIndex((s) => s.value === currentStage);
  const current = stages[currentIndex];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {stages.map((stage, index) => (
          <div
            key={stage.value}
            className={cn(
              "h-2 w-2 rounded-full",
              index < currentIndex && "bg-primary",
              index === currentIndex && "bg-primary ring-2 ring-primary/30",
              index > currentIndex && "bg-muted",
            )}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {current?.label || "Unknown"}
      </span>
    </div>
  );
}
