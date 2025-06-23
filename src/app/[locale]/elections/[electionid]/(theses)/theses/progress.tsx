"use client";

import { useBreakpoint } from "@/hooks/use-breakpoint";
import { Ratings } from "@/schemas/ratings";
import { Thesis } from "@/schemas/thesis";
import { useEffect, useRef, useState } from "react";

interface ProgressProps {
  theses: Thesis[];
  ratings: Ratings;
  current: string;
  onChange: (current: string) => void;
}

export default function Progress({
  theses,
  ratings,
  current,
  onChange,
}: ProgressProps) {
  const [translateX, setTranslateX] = useState(0);
  const progressDotsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useBreakpoint("md");

  const total = theses.length;
  const dotWidth = isDesktop ? 12 : 10; // Width of a dot in pixels
  const dotSpacing = 6; // Spacing between dots in pixels

  // Calculate min and max translateX values (from the center of the progress dots)
  // lastIndex = total - 1
  // middleIndex = lastIndex / 2
  // minTranslateX = -middleIndex * (width of a dot + dot spacing)
  const minTranslateX = -((total - 1) / 2) * (dotWidth + dotSpacing);
  // maxTranslateX = middleIndex * (width of a dot + dot spacing)
  const maxTranslateX = ((total - 1) / 2) * (dotWidth + dotSpacing);

  // Watch for changes in current values and apply the translation
  useEffect(() => {
    const currentIndex = theses.findIndex((t) => t.id === current);
    // Center the progress dots
    // lastIndex = total - 1
    // middleIndex = lastIndex / 2
    // translationX = middleIndex - currentIndex * (width of a dot + dot spacing)
    setTranslateX(((total - 1) / 2 - currentIndex) * (dotWidth + dotSpacing));
  }, [total, current, dotWidth, theses]);

  return (
    <div className="overflow-hidden">
      <div
        ref={progressDotsRef}
        className="flex justify-center -mx-4 py-2 touch-none"
        style={{
          transform: `translateX(${translateX}px)`,
          gap: `${dotSpacing}px`,
          transition: "transform 0.3s",
        }}
      >
        {theses.map((t) => (
          // lastIndex = total - 1
          // width of the dots (only the width that can be moved around) = lastIndex * (width of a dot + dot spacing)
          // center the dots = width of the dots / 2
          // aligned scale (converts translationX from -24..24 to 0..48) = abs(translationX - center of the dots)
          // dotindex (converts pixel translation to index) = aligned scale / 12
          // dotindexprecise = round(dotindex)
          <div
            key={t.id}
            style={{
              width: `${dotWidth}px`,
              height: `${dotWidth}px`,
              lineHeight: `${dotWidth}px`,
            }}
            onClick={() => onChange(t.id)}
            className={`rounded-full transition font-bold text-xs text-center align-middle cursor-pointer ${
              t.id === current
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-accent text-accent-foreground hover:scale-110 hover:bg-primary/80 hover:text-primary-foreground"
            }`}
          >
            {ratings[t.id]?.rating}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {current + 1} / {total}
      </p>
    </div>
  );
}
