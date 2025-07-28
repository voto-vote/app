"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { mockCandidates } from "./mock";
import MatchBar from "@/app/[locale]/elections/[electionid]/(theses)/result/match-bar";
import { Bookmark } from "@/components/icons/bookmark";
import { useTranslations } from "next-intl";

export default function CandidatesList({
  candidates,
  bookmarked,
  onBookmarkToggle,
  filterBookmarked,
  onCandidateClick,
}: {
  candidates: typeof mockCandidates;
  bookmarked: string[];
  onBookmarkToggle: (id: string) => void;
  filterBookmarked?: boolean;
  onCandidateClick: (id: string) => void;
}) {
  const t = useTranslations("CandidatesList");

  return (
    <div className="divide-y">
      {candidates
        .filter((c) => !filterBookmarked || bookmarked.includes(c.id))
        .map((c) => (
          <div
            key={c.id}
            onClick={() => onCandidateClick(c.id)}
            className="w-full text-start flex items-center gap-4 py-4 hover:bg-accent transition-colors cursor-pointer"
          >
            <Image
              src={c.image}
              alt={c.name}
              width={64}
              height={64}
              className="rounded-full object-cover size-16 border"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold md:text-lg truncate">{c.name}</div>
              <div className="text-xs md:text-sm text-muted-foreground truncate">
                {c.party} | {c.list} | {c.listNumber}
              </div>
              <MatchBar value={c.match} className="mt-2" />
            </div>
            <div className="text-primary flex items-center">
              <button
                className="cursor-pointer"
                onClick={(e) => {
                  onBookmarkToggle(c.id);
                  e.stopPropagation();
                }}
                aria-label={t("bookmark")}
              >
                <Bookmark
                  className={`size-8 transition stroke-1 ${bookmarked.includes(c.id) ? "fill-primary stroke-primary" : "fill-muted stroke-muted-foreground/25 hover:fill-muted-foreground/15"}`}
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
