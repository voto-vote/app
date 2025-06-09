"use client";

import { useEffect, useState } from "react";
import ThesisCard from "./thesis-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import PartyMatches from "./party-matches";
import { Button } from "@/components/ui/button";
import BreakDrawer from "./break-drawer";
import Progress from "./progress";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useElectionStore } from "@/stores/election-store";
import { useThesesStore } from "@/stores/theses-store";
import { ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PollInterface() {
  const { election } = useElectionStore();
  const { theses } = useThesesStore();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const count = theses?.length ?? 0;
  const [parties, setParties] = useState([
    {
      id: "spd",
      name: "SPD",
      matchPercentage: 85,
      color: "#E3000F",
    },
    {
      id: "gruene",
      name: "Die Grünen",
      matchPercentage: 78,
      color: "#46962b",
    },
    {
      id: "linke",
      name: "Die Linke",
      matchPercentage: 65,
      color: "#BE3075",
    },
    {
      id: "mannheimer",
      name: "Mannheimer Liste",
      matchPercentage: 45,
      color: "#009ee3",
    },
  ]);
  const [liveMatchesVisible, setLiveMatchesVisible] = useState(true);
  const [ratings, setRatings] = useState<number[]>([]);
  const [breakDrawerOpen, setBreakDrawerOpen] = useState(false);
  const setBackPath = useBackButtonStore((state) => state.setBackPath);
  const t = useTranslations("PollInterface");

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

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!election || !theses) {
    return null;
  }

  function goTo(index: number, skipBreak = false) {
    if (index >= count) {
      return;
    }

    // The timeout makes it possible to highlight the selected rating button before continuing
    setTimeout(() => {
      if (!skipBreak && index % Math.round(theses!.length / 2) === 0) {
        setBreakDrawerOpen(true);
        return;
      }

      api?.scrollTo(index);

      // TODO remove simulated party match updates
      setParties((p) =>
        p.map((party) => {
          party.matchPercentage = Math.floor(Math.random() * 100);
          return party;
        })
      );
    }, 200);
  }

  return (
    <div className="h-full max-h-full flex flex-col justify-between max-w-4xl mx-auto">
      {/* Live party matches */}
      {!election.disableLiveVotes && (
        <div className="shrink-0">
          <PartyMatches
            parties={parties}
            liveMatchesVisible={liveMatchesVisible}
          />

          {/* Live indicator */}
          <div
            className={`fixed left-1/2 -translate-x-1/2 z-10 transition-all duration-300 ${liveMatchesVisible ? "-mt-3" : "-mt-2"}`}
          >
            <div className="bg-white rounded-full">
              <button
                onClick={() => setLiveMatchesVisible(!liveMatchesVisible)}
                className="px-3 py-1 border-2 border-primary rounded-full text-primary font-bold transition-colors hover:bg-votopurple/5 flex items-center gap-1"
              >
                <ChevronsUpDown className="size-4" />
                {t("liveMatchesToggle")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grow flex flex-col">
        <Carousel
          setApi={setApi}
          className="grow md:grow-0 md:h-1/2"
          style={{ containerType: "size" }}
        >
          <CarouselContent>
            {theses.map((thesis) => (
              <CarouselItem key={thesis.id}>
                <ThesisCard thesis={thesis} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Footer */}
        <div className="shrink-0 space-y-2 px-4 pb-4">
          {/* Progress */}
          <Progress
            current={current}
            total={count}
            onChange={(p) => goTo(p, true)}
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
                      const newRatings = [...ratings];
                      newRatings[current] = value;
                      setRatings(newRatings);
                      goTo(current + 1);
                    }}
                    className={`size-16 sm:size-22 rounded-lg font-bold text-2xl transition-all transform hover:scale-105 ${
                      ratings[current] === value
                        ? "bg-primary text-white shadow-lg scale-105"
                        : "bg-zinc-100 text-primary hover:bg-zinc-200"
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
          <Button
            variant="link"
            className="w-full text-primary"
            onClick={() => goTo(current + 1)}
          >
            {t("continueButton")}
          </Button>
        </div>
      </div>
      <BreakDrawer
        onContinue={() => {
          setBreakDrawerOpen(false);
          goTo(current + 1, true);
        }}
        onSkipToResults={() => {
          setBreakDrawerOpen(false);
        }}
        currentQuestion={current}
        totalQuestions={count}
        open={breakDrawerOpen}
        onOpenChange={(o) => {
          setBreakDrawerOpen(o);
          goTo(current + 1, true);
        }}
      />
    </div>
  );
}
