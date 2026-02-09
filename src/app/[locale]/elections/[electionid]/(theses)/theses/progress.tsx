"use client";

import { ResponsiveTooltip } from "@/components/responsive-tooltip";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { normalizedToScaleValue } from "@/lib/result-calculator";
import { Algorithm, Election } from "@/types/election";
import type { Rating, Ratings } from "@/types/ratings";
import type { Theses } from "@/types/theses";
import { Circle, Star } from "lucide-react";
import { Fragment, useMemo } from "react";

interface ProgressProps {
  election: Election;
  theses: Theses;
  userRatings: Ratings;
  currentId: string;
  onCurrentIdChange: (id: string) => void;
}

export default function Progress({
  election,
  theses,
  userRatings,
  currentId,
  onCurrentIdChange,
}: ProgressProps) {
  const isDesktop = useBreakpoint("md");

  const total = theses.length;
  const dotWidth = isDesktop ? 22 : 20; // Width of a dot in pixels
  const dotSpacing = 6; // Spacing between dots in pixels
  const totalWidth = total * (dotWidth + dotSpacing) - dotSpacing;

  const currentIndex = useMemo(
    () => theses.findIndex((t) => t.id === currentId),
    [currentId, theses],
  );

  // Center the progress dots
  // lastIndex = total - 1
  // middleIndex = lastIndex / 2
  // translationX = middleIndex - currentIndex * (width of a dot + dot spacing)
  const leftDistance = useMemo(
    () => ((total - 1) / 2 - currentIndex) * (dotWidth + dotSpacing),
    [total, currentIndex, dotWidth],
  );

  return (
    <div className="h-10 space-y-2">
      <div
        className="fixed flex justify-center touch-none transition-all duration-300"
        style={{
          left: `calc(50% - ${totalWidth / 2}px + ${leftDistance}px)`,
          gap: `${dotSpacing}px`,
          width: `${totalWidth}px`,
        }}
      >
        {theses.map((t) => {
          const rating: Rating = userRatings[t.id] || {
            value: "unrated",
            isFavorite: false,
          };

          const progressDot = (
            <ProgressDot
              rating={rating}
              algorithm={election.algorithm}
              size={dotWidth}
              isSelected={t.id === currentId}
            />
          );

          if (rating.value === "unrated") {
            return <Fragment key={t.id}>{progressDot}</Fragment>;
          }

          return (
            <ResponsiveTooltip
              key={t.id}
              trigger={
                <ProgressDot
                  rating={rating}
                  algorithm={election.algorithm}
                  size={dotWidth}
                  isSelected={t.id === currentId}
                />
              }
              onClick={() => onCurrentIdChange(t.id)}
            >
              <p className="text-wrap cursor-pointer">{t.text}</p>
            </ResponsiveTooltip>
          );
        })}
      </div>

      <p
        className="text-center text-sm text-gray-500 dark:text-gray-400"
        style={{ paddingTop: `calc(${dotWidth * 1.25}px)` }}
      >
        {currentIndex + 1} / {total}
      </p>
    </div>
  );
}

function ProgressDot({
  rating,
  algorithm,
  size,
  isSelected,
}: {
  rating: Rating;
  algorithm: Algorithm;
  size: number;
  isSelected: boolean;
}) {
  let ratingDisplayValue: string;
  switch (rating.value) {
    case "skipped":
      ratingDisplayValue = "-";
      break;
    case "unrated":
      ratingDisplayValue = "";
      break;
    default:
      ratingDisplayValue = normalizedToScaleValue(
        rating.value,
        algorithm.decisions,
      ).toString();
  }

  return (
    <div
      className={`grid place-items-center *:[grid-area:1/1] transition ${rating.value !== "unrated" ? "text-primary hover:scale-125 cursor-pointer" : "text-accent"} ${isSelected ? "scale-125 [&_svg]:stroke-1 [&_svg]:stroke-primary" : ""}`}
      style={{ width: size, height: size }}
    >
      {rating.isFavorite ? (
        <Star className="fill-current" size={size} />
      ) : (
        <Circle className="fill-current" size={size - 2} />
      )}
      <span className="font-semibold text-xs text-primary-foreground">
        {ratingDisplayValue}
      </span>
    </div>
  );
}
