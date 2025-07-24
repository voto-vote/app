"use client";

import { ChevronDown, ChevronUp, Info, Square, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Thesis } from "@/types/theses";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Markdown from "@/components/markdown";
import ThesisText from "@/app/[locale]/elections/[electionid]/(theses)/theses/thesis-text";
import type { Rating } from "@/types/ratings";
import type { Election } from "@/types/election";
import { isLightColor } from "@/lib/color-utils";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/animated-collapsible";

type ParticipantRating = {
  participantId: string;
  participantName: string;
  rating: Rating;
  color?: string;
  explanation?: string;
};

interface ThesisCardProps {
  election: Election;
  thesis: Thesis;
  thesisIndex: number;
  numberOfTheses: number;
  ownRating: Rating;
  participantsRatings: ParticipantRating[];
}

export default function ThesisResultCard({
  election,
  thesis,
  thesisIndex,
  numberOfTheses,
  ownRating,
  participantsRatings,
}: ThesisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedParticipantExplanations, setExpandedParticipantExplanations] =
    useState<Set<string>>(new Set());
  const t = useTranslations("ThesisCard");

  return (
    <div className="flex flex-col justify-center md:justify-end">
      <Card className="p-6 m-4 gap-2 border-none bg-zinc-100 overflow-auto md:max-w-3xl md:mx-auto md:shadow-md md:w-full">
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

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,auto)_minmax(0,1fr)] gap-x-4 items-center mt-4">
          <div className="justify-self-end text-lg">ICH</div>
          <RatingVisualization election={election} rating={ownRating} />
          <div>
            <Button variant="link" className="p-0">
              Meinung ändern
            </Button>
          </div>

          {participantsRatings.map((rating, index) => {
            const backgroundColor =
              rating.color ??
              window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--primary");
            const foregroundColor = isLightColor(backgroundColor)
              ? "var(--color-zinc-900)"
              : "var(--color-zinc-100)";

            return (
              <Fragment key={index}>
                <div
                  className="justify-self-end text-lg rounded truncate px-2 max-w-full"
                  style={{
                    backgroundColor: rating.color,
                    color: foregroundColor,
                  }}
                >
                  {rating.participantName}
                </div>
                <RatingVisualization
                  election={election}
                  rating={rating.rating}
                  backgroundColor={backgroundColor}
                  foregroundColor={foregroundColor}
                />
                <div>
                  {rating.explanation && (
                    <Button
                      variant="link"
                      className="!p-0"
                      onClick={() => {
                        const newSet = new Set(expandedParticipantExplanations);
                        if (
                          expandedParticipantExplanations.has(
                            rating.participantId
                          )
                        ) {
                          newSet.delete(rating.participantId);
                        } else {
                          newSet.add(rating.participantId);
                        }
                        setExpandedParticipantExplanations(newSet);
                      }}
                    >
                      Details
                      <ChevronDown
                        className={`size-6 transition ${expandedParticipantExplanations.has(rating.participantId) ? "rotate-180" : ""}`}
                      />
                    </Button>
                  )}
                </div>
                {rating.explanation && (
                  <div className="col-span-3">
                    <Collapsible
                      open={expandedParticipantExplanations.has(
                        rating.participantId
                      )}
                    >
                      <CollapsibleContent
                        className="rounded"
                        style={{
                          backgroundColor: rating.color,
                          color: foregroundColor,
                        }}
                      >
                        <div className="mx-2 my-1">{rating.explanation}</div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function RatingVisualization({
  election,
  rating,
  backgroundColor = "var(--color-primary)",
  foregroundColor = "var(--color-primary-foreground)",
}: {
  election: Election;
  rating: Rating;
  backgroundColor?: string;
  foregroundColor?: string;
}) {
  const ratingValue = rating.rating ?? 0;

  return (
    <div className="h-8 flex justify-between items-center">
      {Array.from({ length: election.algorithm.decisions }, (_, i) => {
        let resolvedRatingValue: string;
        if (ratingValue === -1) {
          resolvedRatingValue = "-";
        } else if (ratingValue === undefined) {
          resolvedRatingValue = "";
        } else {
          resolvedRatingValue = String(ratingValue);
        }
        return (
          <div
            key={i}
            style={{
              color:
                ratingValue - 1 === i
                  ? backgroundColor
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
              style={{ color: foregroundColor }}
              className="relative font-semibold text-sm text-center align-middle leading-8"
            >
              {ratingValue - 1 === i && resolvedRatingValue}
            </div>
          </div>
        );
      })}
    </div>
  );
}
