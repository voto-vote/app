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

export default function PollInterface() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
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

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  function goToNext() {
    if (current < count) {
      api?.scrollTo(current);
    }
    setParties(
      parties.map((party) => {
        party.matchPercentage = Math.floor(Math.random() * 100);
        return party;
      })
    );
  }

  const { election } = useStore();

  if (!election) {
    return null;
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
                onRate={goToNext}
                onSkip={goToNext}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Footer */}
      <div className="shrink-0 space-y-2 px-4 pb-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-center gap-1">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition ${i === current - 1 ? "bg-votopurple-500" : "bg-zinc-300 dark:bg-votopurple-800"}`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {current} / {count}
          </p>
        </div>

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
                  goToNext();
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
          onClick={goToNext}
        >
          Überspringen
        </Button>
      </div>
    </div>
  );
}
