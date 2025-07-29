"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { convertRatingToDecision } from "@/lib/result-calculator";
import { Election } from "@/types/election";
import type { Ratings } from "@/types/ratings";
import type { Theses } from "@/types/theses";
import { Circle, Star } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [leftDistance, setLeftDistance] = useState(0);
  const isDesktop = useBreakpoint("md");
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = theses.length;
  const dotWidth = isDesktop ? 22 : 20; // Width of a dot in pixels
  const dotSpacing = 6; // Spacing between dots in pixels
  const totalWidth = total * (dotWidth + dotSpacing) - dotSpacing;

  // Set the current index based on the currentId
  useEffect(() => {
    const index = theses.findIndex((t) => t.id === currentId);
    setCurrentIndex(index);
  }, [currentId, theses]);

  // Watch for changes in current values and apply the translation
  useEffect(() => {
    // Center the progress dots
    // lastIndex = total - 1
    // middleIndex = lastIndex / 2
    // translationX = middleIndex - currentIndex * (width of a dot + dot spacing)
    setLeftDistance(((total - 1) / 2 - currentIndex) * (dotWidth + dotSpacing));
  }, [total, currentId, dotWidth, theses, currentIndex]);

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
          const rating = userRatings[t.id] || {
            rating: undefined,
            favorite: false,
          };

          let ratingDisplayValue = "";
          if (rating.rating === -1) {
            ratingDisplayValue = "-";
          } else if (rating.rating !== undefined) {
            ratingDisplayValue = convertRatingToDecision(
              rating.rating,
              election.algorithm.decisions
            ).toString();
          }

          return (
            <div
              key={t.id}
              style={{
                width: `${dotWidth}px`,
                height: `${dotWidth}px`,
                lineHeight: `${dotWidth}px`,
              }}
              onClick={() =>
                rating.rating !== undefined && onCurrentIdChange(t.id)
              }
              className={`relative font-semibold text-xs text-center align-middle transition ${rating.rating !== undefined ? "text-primary hover:scale-125 cursor-pointer" : "text-accent"} ${t.id === currentId ? "scale-125 [&_svg]:stroke-1 [&_svg]:stroke-primary" : ""}`}
            >
              <Tooltip
                delayDuration={500}
                open={rating.rating !== undefined ? undefined : false}
              >
                <TooltipTrigger>
                  {rating.favorite ? (
                    <Star
                      className="absolute inset-0 fill-current"
                      size={dotWidth}
                    />
                  ) : (
                    <Circle
                      className="m-[1px] absolute inset-0 fill-current"
                      size={dotWidth - 2}
                    />
                  )}
                  <span className="relative text-primary-foreground">
                    {ratingDisplayValue}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-screen">
                  <p className="text-wrap">{t.text}</p>
                </TooltipContent>
              </Tooltip>
            </div>
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
