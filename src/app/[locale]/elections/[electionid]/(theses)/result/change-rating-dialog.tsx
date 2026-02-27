import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { Thesis } from "@/types/theses";
import ThesisCard from "../thesis-card";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Election } from "@/types/election";
import { Rating, Ratings, RatingValue } from "@/types/ratings";
import { scaleValueToNormalized } from "@/lib/result-calculator";

interface ChangeRatingDialogProps {
  election: Election;
  userRatings: Ratings;
  thesis: Thesis;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRatingChange: (rating: Rating) => void;
}

export default function ChangeRatingDialog({
  election,
  userRatings,
  thesis,
  open,
  onOpenChange,
  onRatingChange,
}: ChangeRatingDialogProps) {
  const t = useTranslations("ChangeRatingDialog");
  const [newRating, setNewRating] = useState<RatingValue>(
    userRatings[thesis.id]?.value ?? "skipped",
  );
  const [newFavorite, setNewFavorite] = useState<boolean>(
    userRatings[thesis.id]?.isFavorite ?? false,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay className="bg-accent/50 backdrop-blur-md" />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid max-w-[calc(100%-1rem)] translate-x-[-50%] translate-y-[-50%] duration-200"
          }
        >
          <DialogTitle className="sr-only">{t("title")}</DialogTitle>

          <div className="w-screen md:w-3xl -mx-3 md:mx-0 flex flex-col gap-12">
            <ThesisCard
              thesis={thesis}
              onStarredChange={(starred) => setNewFavorite(starred)}
              starDisabled={
                election.algorithm.weightedVotesLimit !== false &&
                Object.values(userRatings).reduce(
                  (n, t) => (t.isFavorite === true ? n + 1 : n),
                  0,
                ) >= election.algorithm.weightedVotesLimit
              }
              starred={newFavorite}
            />

            {/* Rating System */}
            <div className="mx-4 md:mx-0 space-y-2 md:self-center">
              <div className="flex justify-between gap-2 md:gap-4">
                {[1, 2, 3, 4, 5]
                  .slice(0, election.algorithm.decisions)
                  .map((decision, index) => {
                    const ratingValue = scaleValueToNormalized(
                      decision,
                      election.algorithm.decisions,
                    );
                    return (
                      <button
                        key={index}
                        onClick={() => setNewRating(ratingValue)}
                        className={`size-16 sm:size-22 rounded-lg font-bold text-2xl transition-all transform hover:scale-105 backdrop-blur-md ${
                          newRating === ratingValue
                            ? "bg-primary text-white shadow-lg scale-105"
                            : "bg-primary/5 text-primary hover:bg-primary/10"
                        } ${
                          userRatings[thesis.id]?.value === ratingValue
                            ? "border-2 border-primary"
                            : ""
                        }`}
                      >
                        {decision}
                      </button>
                    );
                  })}
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 px-2">
                <span>{t("ratingSystemExplanation")}</span>
                <span>{t("ratingSystemFullAgreement")}</span>
              </div>
            </div>

            <Button
              className="md:w-96 mx-4 md:mx-auto"
              onClick={() => {
                onRatingChange({ value: newRating, isFavorite: newFavorite });
                onOpenChange(false);
              }}
            >
              {newRating === userRatings[thesis.id]?.value &&
              newFavorite === userRatings[thesis.id]?.isFavorite
                ? t("dontChangeOpinion")
                : t("changeOpinion")}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
