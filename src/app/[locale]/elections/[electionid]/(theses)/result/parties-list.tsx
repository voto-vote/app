"use client";

import { ChevronRight } from "lucide-react";
import { mockParties } from "./mock";
import MatchBar from "@/app/[locale]/elections/[electionid]/(theses)/result/match-bar";
import { Bookmark } from "@/components/icons/bookmark";

export default function PartiesList({
  parties,
  bookmarked,
  onBookmarkToggle,
  filterBookmarked,
  onPartyClick,
}: {
  parties: typeof mockParties;
  bookmarked: string[];
  onBookmarkToggle: (id: string) => void;
  filterBookmarked?: boolean;
  onPartyClick: (id: string) => void;
}) {
  return (
    <div className="divide-y">
      {parties
        .filter((p) => !filterBookmarked || bookmarked.includes(p.id))
        .map((p) => (
          <div
            key={p.id}
            onClick={() => onPartyClick(p.id)}
            className="w-full text-start flex items-center gap-4 py-4 hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold text-lg truncate">{p.name}</div>
              <MatchBar value={p.match} color={p.color} className="mt-2" />
            </div>
            <div className="text-primary flex items-center">
              <button
                className="cursor-pointer"
                onClick={(e) => {
                  onBookmarkToggle(p.id);
                  e.stopPropagation();
                }}
                aria-label="Merken"
              >
                <Bookmark
                  className={`size-8 transition stroke-1 ${bookmarked.includes(p.id) ? "fill-primary" : "fill-muted stroke-muted-foreground/25 hover:fill-muted-foreground/15"}`}
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
