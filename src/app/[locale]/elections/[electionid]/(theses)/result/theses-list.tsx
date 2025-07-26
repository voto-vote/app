"use client";

import { motion } from "framer-motion";
import { useElection } from "@/contexts/election-context";
import { useRatingsStore } from "@/stores/ratings-store";
import ThesesResultCarousel from "./theses-result-carousel";
import { useThesesStore } from "@/stores/theses-store";
import LegendBottomBar from "./legend-bottom-bar";

export default function ThesesList() {
  const { election } = useElection();
  const { theses } = useThesesStore();
  const { ratings, setRating, setFavorite } = useRatingsStore();

  if (!theses) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-3xl p-2 pb-14 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 max-w-1/2 text-sm"
      >
        <p className="font-bold">
          So haben Du und die Parteien / Kandidierenden deiner Merkliste
          geantwortet.
        </p>

        <p>
          Klicke / Tippe auf <span className="text-primary">Details</span> um
          die Begründung der / jeweiligen Partei / Kandidierenden zu sehen.
        </p>

        <p>
          Klicke / Tippe auf{" "}
          <span className="text-primary">Meinung ändern</span> um Deine Antwort
          anzupassen.
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

      {/* Bottom Bar Legend */}
      <LegendBottomBar election={election} />
    </div>
  );
}
