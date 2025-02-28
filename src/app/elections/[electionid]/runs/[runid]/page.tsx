"use client";

import React from "react";
import ThesisCard from "./thesis-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import PartyMatches from "./party-matches";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu, QrCode } from "lucide-react";
import ShareDrawer from "./share-drawer";

export default function PollInterface() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [parties, setParties] = React.useState([
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
  const [liveMatchesVisible, setLiveMatchesVisible] = React.useState(true);
  const [ratings, setRatings] = React.useState<number[]>([]);
  const [shareDrawerVisible, setShareDrawerVisible] = React.useState(false);

  React.useEffect(() => {
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

  return (
    <div className="min-h-svh max-h-svh max-w-md mx-auto flex flex-col justify-between bg-votopurple-50/5">
      {/* Header */}
      <header>
        {/* Navigation Bar */}
        <div className="bg-votopurple-500 text-white px-4 py-2 grid grid-cols-[4rem_auto_4rem] items-center">
          <ChevronLeft className="h-6 w-6" />
          <div className="text-center">
            <h1>
              <span className="font-bold">02. MÄRZ</span> 2025
            </h1>
            <p className="text-sm -mt-[0.125rem]">Musterstadt Gemeinderat</p>
          </div>
          <div className="flex gap-4">
            <QrCode
              className="h-6 w-6"
              onClick={() => setShareDrawerVisible(!shareDrawerVisible)}
            />
            <Menu className="h-6 w-6" />
          </div>
        </div>

        {/* Party bars */}
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
            className="px-6 py-1 bg-white border-2 border-votopurple-500 rounded-full text-votopurple-500 font-bold transition-colors hover:bg-votopurple-50 focus:outline-none focus:ring-2 focus:ring-votopurple-100 focus:ring-offset-2"
          >
            LIVE
          </button>
        </div>
      </header>

      {/* Main Content */}
      <Carousel setApi={setApi} opts={{ align: "center" }}>
        <CarouselContent>
          <CarouselItem>
            <ThesisCard
              category="Familienpolitik"
              thesis="In den Volksschulen soll das Familienbild Vater-Mutter-Kind nicht vorrangig vermittelt werden."
              additionalInformation={
                "Die These behandelt, ob das traditionelle Familienbild (Vater-Mutter-Kind) in Volksschulen vorrangig vermittelt werden sollte.\nIn der heutigen Gesellschaft existieren verschiedene Familienformen: Alleinerziehende, Patchwork-Familien und Regenbogenfamilien. Die Debatte bewegt sich zwischen der Wertschätzung traditioneller Familienmodelle und der Anerkennung gesellschaftlicher Vielfalt im Bildungsbereich."
              }
              onRate={goToNext}
              onSkip={goToNext}
            />
          </CarouselItem>
          <CarouselItem>
            <ThesisCard
              category="Klimaschutz"
              thesis="Deutschland soll Vorbild beim Klimaschutz sein, auch wenn andere Länder nicht mitmachen."
              onRate={goToNext}
              onSkip={goToNext}
            />
          </CarouselItem>
          <CarouselItem>
            <ThesisCard
              category="Wirtschaft"
              thesis="Im Burgenland sollen keine weiteren interkommunalen Businessparks auf unbebauten Flächen errichtet werden."
              onRate={goToNext}
              onSkip={goToNext}
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* Footer */}
      <div className="space-y-2 p-4">
        {/* Progress */}
        <div className="space-y-2 p-2">
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

      <ShareDrawer open={shareDrawerVisible} setOpen={setShareDrawerVisible} />
    </div>
  );
}
