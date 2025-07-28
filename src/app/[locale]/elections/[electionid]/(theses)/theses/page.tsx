"use client";

import { useEffect, useState } from "react";
import ThesisCard from "../thesis-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import BreakDrawer from "./break-drawer";
import Progress from "./progress";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useThesesStore } from "@/stores/theses-store";
import { ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useRatingsStore } from "@/stores/ratings-store";
import { motion } from "framer-motion";
import { useElection } from "@/contexts/election-context";
import { usePartiesStore } from "@/stores/party-store";
import { useCandidatesStore } from "@/stores/candidate-store";
import LiveMatches from "./live-matches";
import { useResultStore } from "@/stores/result-store";
import {
  calculateCandidateMatches,
  calculatePartyMatches,
} from "@/lib/result-calculator";
import { UserRating } from "@/types/ratings";

export default function ThesesPage() {
  const { election } = useElection();
  const { parties } = usePartiesStore();
  const { results, setResults, clearResults } = useResultStore();
  const { candidates } = useCandidatesStore();
  const { theses } = useThesesStore();
  const { ratings, setRating, setFavorite } = useRatingsStore();
  const [api, setApi] = useState<CarouselApi>();
  const [currentThesisIndex, setCurrentThesisIndex] = useState(0);
  const count = theses?.length ?? 0;

  const [liveMatchesAvailable, setLiveMatchesAvailable] = useState(false);
  const [liveMatchesVisible, setLiveMatchesVisible] = useState(false);
  const [breakDrawerOpen, setBreakDrawerOpen] = useState(false);
  const { setBackPath } = useBackButtonStore();
  const t = useTranslations("ThesesPage");
  const router = useRouter();

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentThesisIndex(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentThesisIndex(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const electionRatings = ratings[election?.id ?? -1] ?? {};
    const hasRatings = Object.values(electionRatings).some(
      (r) => r.rating !== undefined
    );
    const previousLiveMatchesAvailable = liveMatchesAvailable;

    setLiveMatchesAvailable(hasRatings);
    if (hasRatings && !previousLiveMatchesAvailable) {
      setLiveMatchesVisible(true);
    }
  }, [ratings, election?.id, liveMatchesAvailable]);

  useEffect(() => {
    clearResults();
    const electionRatings = ratings[election?.id ?? -1] ?? {};
    const userRatings: UserRating[] = Object.entries(electionRatings).map(
      ([thesisId, rating]) => ({
        thesisId,
        rating: rating.rating,
        favorite: rating.favorite,
      })
    );
    if (parties === undefined && candidates) {
      const matches = calculateCandidateMatches(
        userRatings,
        candidates,
        election.algorithm.matrix
      );
      setResults([], matches);
    } else if (candidates === undefined && parties) {
      const matches = calculatePartyMatches(
        userRatings,
        parties,
        election.algorithm.matrix
      );
      setResults(matches, []);
    } else if (
      parties &&
      candidates &&
      parties.length > 0 &&
      candidates.length > 0
    ) {
      const partyMatches = calculatePartyMatches(
        userRatings,
        parties!,
        election.algorithm.matrix
      );
      const candidateMatches = calculateCandidateMatches(
        userRatings,
        candidates,
        election.algorithm.matrix
      );
      setResults(partyMatches, candidateMatches);
    }
  }, [
    candidates,
    clearResults,
    election.algorithm.matrix,
    election.id,
    parties,
    ratings,
    setResults,
  ]);

  if (!theses) {
    return null;
  }

  function goTo(index: number, skipBreak = false) {
    if (index >= count) {
      router.push(`/elections/${election!.id}/result`);
      return;
    }

    // The timeout makes it possible to highlight the selected rating button before continuing
    setTimeout(() => {
      if (!skipBreak && index % Math.round(theses!.length / 2) === 0) {
        setBreakDrawerOpen(true);
        return;
      }

      api?.scrollTo(index);
    }, 200);
  }

  return (
    <div className="h-full max-h-full flex flex-col justify-between max-w-4xl mx-auto">
      {/* Live party matches */}
      {!election.disableLiveVotes && liveMatchesAvailable && (
        <motion.div
          className="shrink-0"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <LiveMatches
            entities={results}
            liveMatchesVisible={liveMatchesVisible}
          />
          {/* Live indicator */}
          <div
            className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 shadow bg-white rounded-lg ${liveMatchesVisible ? "-mt-3" : "-mt-2"}`}
          >
            <button
              onClick={() => setLiveMatchesVisible(!liveMatchesVisible)}
              className="px-3 py-1 border-2 border-primary rounded-lg text-primary font-bold transition hover:bg-current/5 hover:scale-105 flex items-center gap-1"
            >
              <motion.div
                animate={{ rotate: liveMatchesVisible ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronsUpDown className="size-4" />
              </motion.div>
              {t("liveMatchesToggle")}
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        className="grow flex flex-col"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Carousel
          setApi={setApi}
          className="grow md:grow-0 md:h-1/2"
          style={{ containerType: "size" }}
          opts={{
            watchDrag: false,
          }}
        >
          <CarouselContent>
            {theses.map((thesis) => (
              <CarouselItem key={thesis.id}>
                <div className="h-[100cqh] flex flex-col justify-center md:justify-end">
                  <ThesisCard
                    thesis={thesis}
                    onStarredChange={(starred) =>
                      setFavorite(election.id, thesis.id, starred)
                    }
                    starDisabled={
                      election.algorithm.weightedVotesLimit !== false &&
                      Object.values(ratings[election.id] ?? {}).reduce(
                        (n, t) => (t.favorite === true ? n + 1 : n),
                        0
                      ) >= election.algorithm.weightedVotesLimit
                    }
                    starred={ratings[election.id]?.[thesis.id]?.favorite}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Footer */}
        <motion.div
          className="shrink-0 space-y-2 px-4 pb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {/* Progress */}
          <Progress
            theses={theses}
            ratings={ratings[election.id] ?? {}}
            currentId={theses[currentThesisIndex]?.id}
            onCurrentIdChange={(id) =>
              goTo(theses.findIndex((t) => t.id === id) ?? 0, true)
            }
          />

          {/* Rating System */}
          <div className="space-y-2 mt-4 md:max-w-lg md:mx-auto">
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5]
                .slice(0, election.algorithm.decisions)
                .map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setRating(
                        election.id,
                        theses[currentThesisIndex]?.id,
                        value
                      );
                      goTo(currentThesisIndex + 1);
                    }}
                    className={`size-16 sm:size-22 rounded-lg font-bold text-2xl transition-all transform hover:scale-105 ${
                      ratings[election.id]?.[theses[currentThesisIndex]?.id]
                        ?.rating === value
                        ? "bg-primary text-white shadow-lg scale-105"
                        : "bg-primary/5 text-primary hover:bg-primary/10"
                    }`}
                  >
                    {value}
                  </button>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 px-2">
              <span>{t("ratingSystemExplanation")}</span>
              <span>{t("ratingSystemFullAgreement")}</span>
            </div>
          </div>

          {/* Action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <Button
              variant="link"
              className="w-full text-primary"
              onClick={() => {
                setRating(election.id, theses[currentThesisIndex]?.id, -1);
                setFavorite(election.id, theses[currentThesisIndex]?.id, false);
                goTo(currentThesisIndex + 1);
              }}
            >
              {t("continueButton")}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      <BreakDrawer
        onContinue={() => {
          setBreakDrawerOpen(false);
          goTo(currentThesisIndex + 1, true);
        }}
        onSkipToResult={() => {
          setBreakDrawerOpen(false);
          // Mark all missed theses as skipped
          for (let i = 0; i < theses.length; i++) {
            if (ratings[election.id]?.[theses[i].id]?.rating === undefined) {
              setRating(election.id, theses[i].id, -1);
            }
          }
          router.push(`/elections/${election.id}/result`);
        }}
        completedTheses={currentThesisIndex}
        totalTheses={count}
        open={breakDrawerOpen}
        onOpenChange={(o) => {
          setBreakDrawerOpen(o);
          goTo(currentThesisIndex + 1, true);
        }}
      />
    </div>
  );
}
