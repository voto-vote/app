"use client";

import { Button } from "@/components/ui/button";
import MatchBar from "@/app/[locale]/elections/[electionid]/(theses)/result/match-bar";
import { useEffect, useState } from "react";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useThesesStore } from "@/stores/theses-store";
import { useRatingsStore } from "@/stores/ratings-store";
import { useElection } from "@/contexts/election-context";
import ThesesResultCarousel from "../../theses-result-carousel";
import BottomBar from "../../bottom-bar";
import { Bookmark } from "@/components/icons/bookmark";

export default function CandidatePage() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { election } = useElection();
  const { theses } = useThesesStore();
  const { ratings, setRating, setFavorite } = useRatingsStore();
  const { setBackPath } = useBackButtonStore();

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}/result`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  if (!theses) {
    return null;
  }

  return (
    <div className="overflow-hidden">
      <div className="container mx-auto max-w-3xl px-2 pb-16 space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="bg-[url(https://picsum.photos/1000/300)] h-36 bg-cover bg-center"></div>
          <div className="absolute left-2 top-18 h-38 w-fit rounded border-4 border-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/votoprod.appspot.com/o/parties%2F3787957%2FpartyPicture.jpg?alt=media"
              }
              alt="Party picture"
              className="object-contain h-full"
            />
          </div>
          <div className="flex items-center ml-42 p-4">
            <MatchBar value={60} className="grow" />
            <button
              aria-label="Merken"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="ml-4"
            >
              <Bookmark
                className={`size-8 transition stroke-1 ${isBookmarked ? "fill-primary stroke-primary" : "fill-muted stroke-muted-foreground/25 hover:fill-muted-foreground/15"}`}
              />
            </button>
          </div>
        </div>

        {/* Party Info */}
        <div>
          <h1 className="text-xl font-bold">Die Grünen Burgenland</h1>
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-4 text-lg">
              Eine glückliche Zukunft mit Wiesenböden statt Betonwüsten,
              lebendigen Ortskernen als Treffpunkt für Jung und Alt, Vertrauen
              und Zuversicht durch transparente Politik und Wirtschaft, ein
              gutes Leben für alle – was wir uns vorstellen können, das können
              wir auch erreichen. Wir GRÜNE bringen den progressiven Wind der
              Veränderung ins Burgenland – für ein lebenswertes Hier und Jetzt
              und eine Zukunft für unsere Kinder und Enkelkinder.
            </div>
            <div className="font-bold text-sm pl-6">
              Liste
              <br />
              Position
              <br />
              Region
            </div>
            <div className="text-sm">
              CDU
              <br />
              6
              <br />
              Stuttgart-Nord
            </div>
          </div>
        </div>

        {/* Theses */}
        <div className="mb-0">
          <h2 className="text-lg font-bold">
            VOTO Antworten von Die Grünen Burgenland
          </h2>

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

        {/* Bottom Bar */}
        <BottomBar>
          <Button variant="ghost">Legende</Button>
        </BottomBar>
      </div>
    </div>
  );
}
