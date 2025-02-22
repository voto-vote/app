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
      setParties(
        parties.map((party) => {
          party.matchPercentage = Math.floor(Math.random() * 100);
          return party;
        })
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-votopurple-50 to-white dark:from-votopurple-950 dark:to-background">
      <div className="min-h-screen max-w-md mx-auto flex flex-col justify-between gap-6 p-4">
        {/* Header */}
        <div className="space-y-4">
          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button className="text-votopurple-600 dark:text-votopurple-400 hover:opacity-80 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-medium truncate flex-1">
              Musterstadt Gemeinderat
            </h1>
            <div className="flex items-center gap-4">
              <button className="bg-votopurple-600 text-white rounded p-1 dark:text-votopurple-400 hover:opacity-80 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="5" height="5" x="3" y="3" rx="1" />
                  <rect width="5" height="5" x="16" y="3" rx="1" />
                  <rect width="5" height="5" x="3" y="16" rx="1" />
                  <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                  <path d="M21 21v.01" />
                  <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                  <path d="M3 12h.01" />
                  <path d="M12 3h.01" />
                  <path d="M12 16v.01" />
                  <path d="M16 12h1" />
                  <path d="M21 12v.01" />
                  <path d="M12 21v-1" />
                </svg>
              </button>
              <button className="text-votopurple-600 dark:text-votopurple-400 hover:opacity-80 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          {/* Party Matches */}
          <div className="relative">
            <PartyMatches parties={parties} />
          </div>
        </div>

        {/* Main Content */}

        <Carousel setApi={setApi} className="-mx-4">
          <CarouselContent>
            <CarouselItem>
              <ThesisCard
                category="Familienpolitik"
                thesis="In den Volksschulen soll das Familienbild Vater-Mutter-Kind nicht vorrangig vermittelt werden."
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

        {/* Progress */}
        <div className="space-y-2 p-2">
          <div className="flex justify-center gap-1">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition ${i === current - 1 ? "bg-votopurple-600" : "bg-votopurple-200 dark:bg-votopurple-800"}`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {current} / {count}
          </p>
        </div>
      </div>
    </div>
  );
}
