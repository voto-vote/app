"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import MatchBar from "@/app/[locale]/elections/[electionid]/(theses)/result/match-bar";
import { Bookmark } from "@/components/icons/bookmark";
import { useTranslations } from "next-intl";
import { Results } from "@/types/result";
import { Parties } from "@/types/party";

export default function CandidatesList({
  results,
  parties,
  bookmarked,
  onBookmarkToggle,
  filterBookmarked,
  onCandidateClick,
}: {
  results: Results;
  parties: Parties;
  bookmarked: number[];
  onBookmarkToggle: (id: number) => void;
  filterBookmarked?: boolean;
  onCandidateClick: (id: number) => void;
}) {
  const t = useTranslations("CandidatesList");

  return (
    <div className="divide-y">
      {results.candidateResults
        .filter((r) => !filterBookmarked || bookmarked.includes(r.entity.id))
        .map((r) => {
          const party = parties.find((p) => p.id === r.entity.partyId);

          return (
            <div
              key={r.entity.id}
              onClick={() => onCandidateClick(r.entity.id)}
              className="w-full text-start flex items-center gap-4 py-4 hover:bg-accent transition-colors cursor-pointer"
            >
              <Image
                src={r.entity.image}
                alt={r.entity.displayName}
                width={64}
                height={64}
                className="rounded-full object-cover size-16 border"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold md:text-lg truncate">
                  {r.entity.displayName}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground truncate">
                  {party?.displayName ?? t("unknownParty")} |{" "}
                  {r.entity.district} | #{r.entity.listPlace}
                </div>
                <MatchBar value={r.matchPercentage} className="mt-2" />
              </div>
              <div className="text-primary flex items-center">
                <button
                  className="cursor-pointer"
                  onClick={(e) => {
                    onBookmarkToggle(r.entity.id);
                    e.stopPropagation();
                  }}
                  aria-label={t("bookmark")}
                >
                  <Bookmark
                    className={`size-8 transition stroke-1 ${bookmarked.includes(r.entity.id) ? "fill-primary stroke-primary" : "fill-muted stroke-muted-foreground/25 hover:fill-muted-foreground/15"}`}
                  />
                </button>
                <button className="cursor-pointer">
                  <ChevronRight className="size-10" />
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
