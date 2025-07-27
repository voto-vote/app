"use client";

import MatchBar from "@/app/[locale]/elections/[electionid]/(theses)/result/match-bar";
import { useEffect, useState } from "react";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useThesesStore } from "@/stores/theses-store";
import { useRatingsStore } from "@/stores/ratings-store";
import { useElection } from "@/contexts/election-context";
import ThesesResultCarousel from "../../../theses-result-carousel";
import { Bookmark } from "@/components/icons/bookmark";
import LegendBottomBar from "../../../legend-bottom-bar";
import CandidateOrParty from "../../candidate-or-party";

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
    <CandidateOrParty
      participant={{
        id: "42",
        name: "Die Grünen Burgenland",
        image:
          "https://firebasestorage.googleapis.com/v0/b/votoprod.appspot.com/o/parties%2F3787957%2FpartyPicture.jpg?alt=media",
        description:
          "Eine glückliche Zukunft mit Wiesenböden statt Betonwüsten, lebendigen Ortskernen als Treffpunkt für Jung und Alt, Vertrauen und Zuversicht durch transparente Politik und Wirtschaft, ein gutes Leben für alle – was wir uns vorstellen können, das können wir auch erreichen. Wir GRÜNE bringen den progressiven Wind der Veränderung ins Burgenland – für ein lebenswertes Hier und Jetzt und eine Zukunft für unsere Kinder und Enkelkinder.",
      }}
    />
  );
}
