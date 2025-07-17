"use client";

import { ChevronDown, ChevronUp, Info, Square, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Thesis } from "@/types/theses";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Markdown from "@/components/markdown";
import ThesisText from "@/app/[locale]/elections/[electionid]/(theses)/theses/thesis-text";
import { Rating } from "@/types/ratings";
import { Election } from "@/types/election";
import { isLightColor } from "@/lib/color-utils";

interface ThesisCardProps {
  election: Election;
  thesis: Thesis;
  thesisIndex: number;
  numberOfTheses: number;
  ownRating: Rating;
}

export default function ThesisResultCard({
  election,
  thesis,
  thesisIndex,
  numberOfTheses,
  ownRating,
}: ThesisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("ThesisCard");

  return (
    <div className="flex flex-col justify-center md:justify-end">
      <Card className="p-6 m-4 gap-2 border-none bg-zinc-100 overflow-auto md:max-w-3xl md:mx-auto md:shadow-md">
        <div className="flex items-start justify-between leading-relaxed text-gray-600">
          <div>{thesis.category}</div>
          <div>
            {thesisIndex + 1} / {numberOfTheses}
          </div>
        </div>

        <ThesisText thesis={thesis} />

        {thesis.additionalInfos && (
          <div>
            <Button
              variant={"ghost"}
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary hover:bg-accent-foreground/5 transition-colors -ml-3"
            >
              <Info className="size-5" />
              {t("moreInfos")}
              {isExpanded ? (
                <ChevronUp className="size-5" />
              ) : (
                <ChevronDown className="size-5" />
              )}
            </Button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    marginTop: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    marginTop: 16,
                  }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-2 rounded-lg text-sm text-gray-700 space-y-2">
                    <Markdown content={thesis.additionalInfos} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="grid grid-cols-8 gap-4 items-center mt-4">
          <div className="col-span-3 text-right">ICH</div>
          <div className="col-span-2">
            <RatingVisualization
              election={election}
              rating={ownRating}
              color="#ffffff"
            />
          </div>
          <div className="col-span-3">
            <Button variant="link" className="p-0">
              Meinung ändern
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function RatingVisualization({
  election,
  rating,
  color,
}: {
  election: Election;
  rating: Rating;
  color?: string;
}) {
  const ratingValue = rating.rating ?? 0;
  const resolvedColor =
    color ??
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--primary");
  const resolvedForegroundColor = isLightColor(resolvedColor)
    ? "var(--color-zinc-900)"
    : "var(--color-zinc-100)";

  return (
    <div className="h-8 flex justify-between items-center">
      {Array.from({ length: election.algorithm.decisions }, (_, i) => (
        <div
          key={i}
          style={{
            color:
              ratingValue - 1 === i
                ? (color ?? "var(--primary)")
                : "var(--color-zinc-200)",
          }}
          className="relative size-8"
        >
          {rating.favorite && ratingValue - 1 === i ? (
            <Star className="absolute inset-0 fill-current size-full" />
          ) : (
            <Square className="absolute inset-0 fill-current size-full" />
          )}
          <div
            style={{ color: resolvedForegroundColor }}
            className="relative font-semibold text-sm text-center align-middle leading-8"
          >
            {ratingValue - 1 === i && i + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
