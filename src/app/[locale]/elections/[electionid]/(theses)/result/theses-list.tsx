"use client";

import { motion } from "framer-motion";
import { useElection } from "@/contexts/election-context";
import { useRatingsStore } from "@/stores/ratings-store";
import ThesesResultCarousel from "./thesis-result-carousel";
import { useThesesStore } from "@/stores/theses-store";
import LegendBottomBar from "./legend-bottom-bar";
import { useTranslations } from "next-intl";
import { usePointer } from "@/hooks/use-pointer";

export default function ThesesList() {
  const { election } = useElection();
  const { theses } = useThesesStore();
  const { ratings, setRating, setFavorite } = useRatingsStore();
  const isCoarsePointer = usePointer();
  const t = useTranslations("ThesesList");

  if (!theses) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto max-w-3xl p-2 pb-13 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 md:max-w-1/2 text-sm"
        >
          <p className="font-bold">
            {t("explanation", {
              matchType: election.algorithm.matchType,
            })}
          </p>

          <p>
            {t.rich("detailsInfo", {
              pointer: isCoarsePointer ? "coarse" : "fine",
              matchType: election.algorithm.matchType,
              details: (chunks) => (
                <span className="text-primary">{chunks}</span>
              ),
            })}
          </p>

          <p>
            {t.rich("changeOpinionInfo", {
              pointer: isCoarsePointer ? "coarse" : "fine",
              changeopinion: (chunks) => (
                <span className="text-primary">{chunks}</span>
              ),
            })}
          </p>
        </motion.div>

        {/* Theses List */}
        <div>
          <ThesesResultCarousel
            election={election}
            theses={theses}
            ratings={ratings[election.id]}
            onRatingChange={(thesisId, newRating) => {
              if (newRating.rating !== undefined) {
                setRating(election.id, thesisId, newRating.rating);
              }
              setFavorite(election.id, thesisId, newRating.favorite);
            }}
          />
        </div>
      </div>

      {/* Bottom Bar Legend */}
      <LegendBottomBar election={election} />
    </>
  );
}
