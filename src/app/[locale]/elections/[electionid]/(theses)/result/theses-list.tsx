"use client";

import { motion } from "framer-motion";
import { useElection } from "@/contexts/election-context";
import { useUserRatingsStore } from "@/stores/user-ratings-store";
import ThesesResultCarousel from "./thesis-result-carousel";
import { useThesesStore } from "@/stores/theses-store";
import LegendBottomBar from "./legend-bottom-bar";
import { useTranslations } from "next-intl";
import { usePointer } from "@/hooks/use-pointer";
import { useCandidatesStore } from "@/stores/candidate-store";
import { usePartiesStore } from "@/stores/party-store";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useMemo } from "react";
import { Entities } from "@/types/entity";

export default function ThesesList({
  disableBookmarks = false,
}: {
  disableBookmarks?: boolean;
}) {
  const { election } = useElection();
  const { theses } = useThesesStore();
  const { candidates } = useCandidatesStore();
  const { parties } = usePartiesStore();
  const { userRatings, setUserRatingValue, setUserRatingFavorite } =
    useUserRatingsStore();
  const { bookmarks } = useBookmarkStore();
  const pointer = usePointer();
  const t = useTranslations("ThesesList");

  const filteredEntities = useMemo<Entities>(() => {
    const bookmarksThisElection = bookmarks[election.id] || {};

    const filteredParties = (parties ?? []).filter(
      (p) =>
        disableBookmarks ||
        (bookmarksThisElection.parties ?? []).includes(p.id),
    );
    const filteredCandidates = (candidates ?? []).filter(
      (c) =>
        disableBookmarks ||
        (bookmarksThisElection.candidates ?? []).includes(c.id),
    );

    return [...filteredCandidates, ...filteredParties];
  }, [bookmarks, candidates, parties, election.id, disableBookmarks]);

  if (!theses) {
    return null;
  }

  return (
    <div className="overflow-hidden">
      <div className="container mx-auto max-w-3xl p-2 pb-13 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <p className="font-bold">
            {!disableBookmarks &&
              t("explanation", {
                matchType: election.algorithm.matchType,
              })}
            {disableBookmarks &&
              t("explanationNoBookmarks", {
                matchType: election.algorithm.matchType,
              })}
          </p>

          <p className="text-sm">
            {t.rich("detailsInfo", {
              pointer,
              matchType: election.algorithm.matchType,
              details: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </p>

          <p className="text-sm">
            {t.rich("changeOpinionInfo", {
              pointer,
              changeopinion: (chunks) => (
                <span className="font-bold">{chunks}</span>
              ),
            })}
          </p>
        </motion.div>

        {/* Theses List */}
        <div>
          <ThesesResultCarousel
            election={election}
            theses={theses}
            userRatings={userRatings[election.id] ?? {}}
            entities={filteredEntities}
            onRatingChange={(thesisId, newRating) => {
              setUserRatingValue(election.id, thesisId, newRating.value);
              setUserRatingFavorite(
                election.id,
                thesisId,
                newRating.isFavorite,
              );
            }}
          />
        </div>
      </div>

      {/* Bottom Bar Legend */}
      <LegendBottomBar election={election} />
    </div>
  );
}
