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
import type { Rating, Ratings } from "@/types/ratings";
import type { Election } from "@/types/election";
import { isLightColor } from "@/lib/color-utils";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/animated-collapsible";
import ChangeRatingDialog from "./change-rating-dialog";
import { Entity } from "@/types/entity";
import { normalizedToScaleValue } from "@/lib/result-calculator";
import { abbreviateName } from "@/lib/entity-utils";

type EntityRating = {
  entity: Entity;
  rating: Rating;
};

interface ThesisCardProps {
  election: Election;
  userRatings: Ratings;
  thesis: Thesis;
  thesisIndex: number;
  numberOfTheses: number;
  ownRating: Rating;
  entityRatings: EntityRating[];
  onRatingChange: (rating: Rating) => void;
  isDesktop: boolean;
}

export default function ThesisResultCard({
  election,
  userRatings,
  thesis,
  thesisIndex,
  numberOfTheses,
  ownRating,
  entityRatings,
  onRatingChange,
  isDesktop,
}: ThesisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedParticipantExplanations, setExpandedParticipantExplanations] =
    useState<Set<number>>(new Set());
  const [changeRatingDialogOpen, setChangeRatingDialogOpen] = useState(false);
  const t = useTranslations("ThesisResultCard");

  return (
    <div className="flex flex-col justify-center md:justify-end">
      <Card className="p-4 md:p-6 m-2 md:m-4 gap-2 border border-zinc-300 bg-zinc-100 overflow-auto md:max-w-3xl md:mx-auto shadow-none md:w-full">
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

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,auto)_minmax(0,1fr)] gap-x-2 md:gap-x-4 items-center mt-4">
          <div className="justify-self-end text-sm sm:text-base md:text-lg uppercase">
            {t("i")}
          </div>
          <RatingVisualization election={election} rating={ownRating} />
          <div>
            <Button
              size={isDesktop ? "default" : "sm"}
              variant="link"
              className="p-0 max-h-6 sm:max-h-none max-w-full block truncate"
              onClick={() => setChangeRatingDialogOpen(true)}
            >
              {t("changeRating")}
            </Button>
          </div>

          {entityRatings.map((er, index) => {
            const backgroundColor = er.entity.color || "var(--primary)";
            const foregroundColor = isLightColor(backgroundColor)
              ? "var(--color-zinc-900)"
              : "var(--color-zinc-100)";

            return (
              <Fragment key={index}>
                <div
                  className="justify-self-end text-sm sm:text-base md:text-lg rounded truncate px-2 max-w-full"
                  style={{
                    backgroundColor: backgroundColor,
                    color: foregroundColor,
                  }}
                >
                  {er.entity.type === "candidate"
                    ? abbreviateName(er.entity.displayName)
                    : er.entity.displayName}
                </div>

                <RatingVisualization
                  election={election}
                  rating={er.rating}
                  backgroundColor={backgroundColor}
                  foregroundColor={foregroundColor}
                />

                <div>
                  {er.rating.explanation && (
                    <Button
                      size={isDesktop ? "default" : "sm"}
                      variant="link"
                      className="p-0! max-h-6 sm:max-h-none whitespace-normal"
                      onClick={() => {
                        const newSet = new Set(expandedParticipantExplanations);
                        if (expandedParticipantExplanations.has(er.entity.id)) {
                          newSet.delete(er.entity.id);
                        } else {
                          newSet.add(er.entity.id);
                        }
                        setExpandedParticipantExplanations(newSet);
                      }}
                    >
                      {t("details")}
                      <ChevronDown
                        className={`size-6 transition ${expandedParticipantExplanations.has(er.entity.id) ? "rotate-180" : ""}`}
                      />
                    </Button>
                  )}
                </div>
                {er.rating.explanation && (
                  <div className="col-span-3">
                    <Collapsible
                      open={expandedParticipantExplanations.has(er.entity.id)}
                    >
                      <CollapsibleContent>
                        <div
                          className="my-1 rounded"
                          style={{
                            backgroundColor: backgroundColor,
                            color: foregroundColor,
                          }}
                        >
                          <div className="px-2 py-1 text-sm sm:text-base">
                            {er.rating.explanation}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </Card>

      <ChangeRatingDialog
        election={election}
        userRatings={userRatings}
        thesis={thesis}
        open={changeRatingDialogOpen}
        onOpenChange={setChangeRatingDialogOpen}
        onRatingChange={onRatingChange}
      />
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
  let decision = undefined;
  if (rating.value !== "unrated" && rating.value !== "skipped") {
    decision = normalizedToScaleValue(
      rating.value,
      election.algorithm.decisions,
    );
  }

  let ratingDisplayValue = "";
  if (rating.value === "skipped") {
    ratingDisplayValue = "-";
  } else if (rating.value !== "unrated") {
    ratingDisplayValue = decision?.toString() ?? "";
  }

  return (
    <div
      className={`h-6 md:h-8 flex justify-between items-center ${rating.value === "skipped" ? "justify-center" : "justify-between"}`}
    >
      {rating.value !== "skipped" &&
        Array.from({ length: election.algorithm.decisions }, (_, i) => {
          return (
            <div
              key={i}
              style={{
                color:
                  decision === i + 1
                    ? backgroundColor
                    : "var(--color-zinc-200)",
              }}
              className="relative size-6 md:size-8"
            >
              {rating.isFavorite && decision === i + 1 ? (
                <Star className="absolute inset-0 fill-current size-full" />
              ) : (
                <Square className="absolute inset-0 fill-current size-full" />
              )}
              <div
                style={{ color: foregroundColor }}
                className="relative font-semibold text-sm text-center align-middle leading-6 md:leading-8"
              >
                {decision === i + 1 && ratingDisplayValue}
              </div>
            </div>
          );
        })}
      {rating.value === "skipped" && (
        <div
          style={{
            color: backgroundColor,
          }}
          className="relative size-6 md:size-8"
        >
          <Square className="absolute inset-0 fill-current size-full" />
          <div
            style={{ color: foregroundColor }}
            className="relative font-semibold text-sm text-center align-middle leading-6 md:leading-8"
          >
            -
          </div>
        </div>
      )}
    </div>
  );
}
