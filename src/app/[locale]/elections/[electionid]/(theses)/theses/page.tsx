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
import { useUserRatingsStore } from "@/stores/user-ratings-store";
import { motion } from "framer-motion";
import { useElection } from "@/contexts/election-context";
import LiveMatches from "./live-matches";
import { useResultStore } from "@/stores/result-store";
import { convertDecisionToRating } from "@/lib/result-calculator";
import { EventsAPI } from "@/lib/api";
import { useDataSharingStore } from "@/stores/data-sharing-store";
import { useIntroStore } from "@/stores/intro-store";

export default function ThesesPage() {
  const { election } = useElection();
  const { results } = useResultStore();
  const { theses } = useThesesStore();
  const { userRatings, setUserRating, setUserFavorite } = useUserRatingsStore();
  const [api, setApi] = useState<CarouselApi>();
  const [currentThesisIndex, setCurrentThesisIndex] = useState(0);
  const [liveMatchesAvailable, setLiveMatchesAvailable] = useState(false);
  const [liveMatchesVisible, setLiveMatchesVisible] = useState(false);
  const [breakDrawerOpen, setBreakDrawerOpen] = useState(false);
  const { setSharingId, dataSharingEnabled } = useDataSharingStore();
  const { setBackPath } = useBackButtonStore();
  const { resultIntroSeen } = useIntroStore();
  const t = useTranslations("ThesesPage");
  const count = theses?.length ?? 0;
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
    const electionRatings = userRatings[election.id] ?? {};
    const hasRatings = Object.values(electionRatings).some(
      (r) => r.rating !== undefined
    );
    const previousLiveMatchesAvailable = liveMatchesAvailable;

    setLiveMatchesAvailable(hasRatings);
    if (hasRatings && !previousLiveMatchesAvailable) {
      setLiveMatchesVisible(true);
    }
  }, [userRatings, election.id, liveMatchesAvailable]);

  useEffect(() => {
    if (theses) {
      const ratings = userRatings[election.id] ?? {};

      let newIndex = 0;
      for (let i = 0; i < theses.length; i++) {
        const these = theses[i];
        const theseRating = ratings[these.id];
        if (!theseRating) {
          newIndex = i;
          break;
        }
        if (i + 1 === theses.length) {
          newIndex = i;
        }
      }

      if (newIndex > 0) {
        api?.scrollTo(newIndex);
      }
    }
    // It should ONLY update, when the theses change, NOT when the user ratings change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, election.id, theses]);

  if (!theses) {
    return null;
  }

  function sendVotoFinishedEvent(skippedToResult: boolean) {
    if (dataSharingEnabled) {
      EventsAPI.createEvent({
        electionId: election.id,
        eventType: "voto_finished",
        ratings: userRatings[election.id] ?? {},
        metadata: {
          shortcut: skippedToResult,
        },
      }).then((data) => data && setSharingId(data));
    }
  }

  function goTo(index: number, skipBreak = false) {
    if (index >= count) {
      sendVotoFinishedEvent(false);
      goToIntroOrResult();
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

  function goToIntroOrResult() {
    if (resultIntroSeen) {
      router.push(`/elections/${election.id}/result`);
    } else {
      router.push(`/elections/${election.id}/result/intro`);
    }
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
            entityType={
              election.algorithm.matchType === "parties" ||
              election.algorithm.matchType === "candidates-and-parties"
                ? "party"
                : "candidate"
            }
            results={results}
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
                      setUserFavorite(election.id, thesis.id, starred)
                    }
                    starDisabled={
                      election.algorithm.weightedVotesLimit !== false &&
                      Object.values(userRatings[election.id] ?? {}).reduce(
                        (n, t) => (t.favorite === true ? n + 1 : n),
                        0
                      ) >= election.algorithm.weightedVotesLimit
                    }
                    starred={userRatings[election.id]?.[thesis.id]?.favorite}
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
            election={election}
            theses={theses}
            userRatings={userRatings[election.id] ?? {}}
            currentId={theses[currentThesisIndex]?.id}
            onCurrentIdChange={(id) =>
              goTo(theses.findIndex((t) => t.id === id) ?? 0, true)
            }
          />

          {/* Rating System */}
          <div className="space-y-2 mt-4 md:max-w-lg md:mx-auto">
            <div
              className={`flex gap-2 ${election.algorithm.decisions < 5 ? "justify-around" : "justify-between"}`}
            >
              {[1, 2, 3, 4, 5]
                .slice(0, election.algorithm.decisions)
                .map((decision, index) => {
                  const ratingValue = convertDecisionToRating(
                    decision,
                    election.algorithm.decisions
                  );
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setUserRating(
                          election.id,
                          theses[currentThesisIndex]?.id,
                          ratingValue
                        );
                        goTo(currentThesisIndex + 1);
                      }}
                      className={`size-16 sm:size-22 rounded-lg font-bold text-2xl transition-all transform hover:scale-105 ${
                        userRatings[election.id]?.[
                          theses[currentThesisIndex]?.id
                        ]?.rating === ratingValue
                          ? "bg-primary text-white shadow-lg scale-105"
                          : "bg-primary/5 text-primary hover:bg-primary/10"
                      }`}
                    >
                      {decision}
                    </button>
                  );
                })}
            </div>
            <div
              className={`grid place-items-center text-center gap-2 text-xs text-gray-600 dark:text-gray-400`}
              style={{
                gridTemplateColumns: `repeat(${election.algorithm.decisions}, minmax(0, 1fr))`,
              }}
            >
              <span className="col-start-1">
                {t("ratingSystemExplanation")}
              </span>
              <span
                style={{
                  gridColumnStart: Math.ceil(election.algorithm.decisions / 2),
                }}
              >
                {t("ratingSystemNeutral")}
              </span>
              <span style={{ gridColumnStart: election.algorithm.decisions }}>
                {t("ratingSystemFullAgreement")}
              </span>
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
                setUserRating(election.id, theses[currentThesisIndex]?.id, -1);
                setUserFavorite(
                  election.id,
                  theses[currentThesisIndex]?.id,
                  false
                );
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
            if (
              userRatings[election.id]?.[theses[i].id]?.rating === undefined
            ) {
              setUserRating(election.id, theses[i].id, -1);
            }
          }
          sendVotoFinishedEvent(true);
          goToIntroOrResult();
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
