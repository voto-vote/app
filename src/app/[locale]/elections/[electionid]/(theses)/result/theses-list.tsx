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
import { useEffect, useState } from "react";
import { Entities } from "@/types/entity";

export default function ThesesList() {
  const { election } = useElection();
  const { theses } = useThesesStore();
  const { candidates } = useCandidatesStore();
  const { parties } = usePartiesStore();
  const { userRatings, setUserRating, setUserFavorite } = useUserRatingsStore();
  const { bookmarks } = useBookmarkStore();
  const [filteredEntities, setFilteredEntities] = useState<Entities>([]);
  const pointer = usePointer();
  const t = useTranslations("ThesesList");

  useEffect(() => {
    const bookmarksThisElection = bookmarks[election.id] || {};

    const filteredParties = (parties ?? []).filter((p) =>
      (bookmarksThisElection.parties ?? []).includes(p.id)
    );
    const filteredCandidates = (candidates ?? []).filter((c) =>
      (bookmarksThisElection.candidates ?? []).includes(c.id)
    );

    const entities: Entities = [...filteredCandidates, ...filteredParties];

    setFilteredEntities(entities);
  }, [bookmarks, candidates, parties, election.id]);

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
            {t("explanation", {
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
              if (newRating.rating !== undefined) {
                setUserRating(election.id, thesisId, newRating.rating);
              }
              setUserFavorite(election.id, thesisId, newRating.favorite);
            }}
          />
        </div>
      </div>

      {/* Bottom Bar Legend */}
      <LegendBottomBar election={election} />
    </div>
  );
}
