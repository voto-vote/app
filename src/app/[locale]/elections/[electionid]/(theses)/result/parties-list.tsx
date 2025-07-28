"use client";

import { ChevronRight } from "lucide-react";
import MatchBar from "@/app/[locale]/elections/[electionid]/(theses)/result/match-bar";
import { Bookmark } from "@/components/icons/bookmark";
import { Results } from "@/types/result";

export default function PartiesList({
  results,
  bookmarked,
  onBookmarkToggle,
  filterBookmarked,
  onPartyClick,
}: {
  results: Results;
  bookmarked: number[];
  onBookmarkToggle: (id: number) => void;
  filterBookmarked?: boolean;
  onPartyClick: (id: number) => void;
}) {
  return (
    <div className="divide-y">
      {results.partyResults
        .filter((r) => !filterBookmarked || bookmarked.includes(r.entity.id))
        .map((r) => (
          <div
            key={r.entity.id}
            onClick={() => onPartyClick(r.entity.id)}
            className="w-full text-start flex items-center gap-4 py-4 hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold md:text-lg truncate">
                {r.entity.displayName}
              </div>
              <MatchBar
                value={r.matchPercentage}
                color={r.entity.color}
                className="mt-2"
              />
            </div>
            <div className="text-primary flex items-center">
              <button
                className="cursor-pointer"
                onClick={(e) => {
                  onBookmarkToggle(r.entity.id);
                  e.stopPropagation();
                }}
                aria-label="Merken"
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
        ))}
    </div>
  );
}
