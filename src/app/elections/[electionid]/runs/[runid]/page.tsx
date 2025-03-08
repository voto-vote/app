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
import { useStore } from "@/store";
import BreakDrawer from "./break-drawer";
import Progress from "./progress";

export default function PollInterface() {
  const { election } = useStore();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const count = election?.theses.length ?? 0;
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

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!election) {
    return null;
  }

  function goTo(index: number, skipBreak = false) {
    if (index >= count) {
      return;
    }

    // The timeout makes it possible to highlight the selected rating button before continuing
    setTimeout(() => {
      if (!skipBreak && index % (election?.thesesPerBreak ?? -1) === 0) {
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
    <div className="h-full max-h-full flex flex-col justify-between bg-votopurple-50/5">
      {/* Live party matches */}
      <div className="shrink-0">
        <PartyMatches
          parties={parties}
          liveMatchesVisible={liveMatchesVisible}
        />

        {/* Live indicator */}
        <div
          className={`flex justify-center transition-all duration-300 ${liveMatchesVisible ? "-mt-3" : "-mt-2"}`}
        >
          <button
            onClick={() => setLiveMatchesVisible(!liveMatchesVisible)}
            className="px-6 py-1 bg-white border-2 border-votopurple-500 rounded-full text-votopurple-500 font-bold transition-colors hover:bg-votopurple-50"
          >
            LIVE
          </button>
        </div>
      </div>

      {/* Main Content */}
      <Carousel
        setApi={setApi}
        className="grow"
        style={{ containerType: "size" }}
      >
        <CarouselContent>
          {election.theses.map((thesis) => (
            <CarouselItem key={thesis.id}>
              <ThesisCard
                category={thesis.category}
                thesis={thesis.thesis}
                additionalInformation={thesis.additionalInformation}
                onRate={() => goTo(current + 1)}
                onSkip={() => goTo(current + 1)}
              />
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
        <div className="space-y-2 mt-4">
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => {
                  const newRatings = [...ratings];
                  newRatings[current] = value;
                  setRatings(newRatings);
                  goTo(current + 1);
                }}
                className={`w-16 h-16 rounded-lg font-bold text-2xl transition-all transform hover:scale-105 ${
                  ratings[current] === value
                    ? "bg-votopurple-500 text-white shadow-lg scale-105"
                    : "bg-zinc-100 text-votopurple-500 hover:bg-zinc-200 dark:bg-votopurple-900/50 dark:text-votopurple-100 dark:hover:bg-votopurple-800/70"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 px-2">
            <span>keine Zustimmung</span>
            <span>volle Zustimmung</span>
          </div>
        </div>

        {/* Action */}
        <Button
          variant="link"
          className="w-full text-votopurple-500 dark:text-votopurple-400"
          onClick={() => goTo(current + 1)}
        >
          Überspringen
        </Button>
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
