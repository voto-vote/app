"use client";

import { Bookmark, ChevronRight } from "lucide-react";
import Image from "next/image";
import { mockCandidates } from "./mock";
import MatchBar from "./MatchBar";

export default function CandidatesList({
  candidates,
  bookmarkList,
  setBookmarkList,
  onCandidateClick,
}: {
  candidates: typeof mockCandidates;
  bookmarkList: string[];
  setBookmarkList: (ids: string[]) => void;
  onCandidateClick: (id: string) => void;
}) {
  return (
    <div className="divide-y">
      {candidates.map((c) => (
        <div
          key={c.id}
          onClick={() => onCandidateClick(c.id)}
          className="w-full text-start flex items-center gap-4 py-4 hover:bg-accent transition-colors cursor-pointer"
        >
          <Image
            src={c.image}
            alt={c.name}
            width={56}
            height={56}
            className="rounded-full object-cover size-16 border"
          />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate">{c.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {c.party} | {c.list} | {c.listNumber}
            </div>
            <MatchBar value={c.match} className="mt-2" />
          </div>
          <div className="text-primary flex items-center">
            <button
              className="cursor-pointer"
              onClick={(e) => {
                setBookmarkList(
                  bookmarkList.includes(c.id)
                    ? bookmarkList.filter((id) => id !== c.id)
                    : [...bookmarkList, c.id]
                );
                e.stopPropagation();
              }}
              aria-label="Merken"
            >
              <Bookmark
                className={`size-8 transition ${bookmarkList.includes(c.id) ? "fill-current" : "fill-transparent hover:fill-current/25"}`}
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
