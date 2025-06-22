"use client";

import { Bookmark, ChevronRight } from "lucide-react";
import { mockParties } from "./mock";
import MatchBar from "./MatchBar";

export default function PartiesList({
  parties,
  bookmarkList,
  setBookmarkList,
  onPartyClick,
}: {
  parties: typeof mockParties;
  bookmarkList: string[];
  setBookmarkList: (ids: string[]) => void;
  onPartyClick: (id: string) => void;
}) {
  return (
    <div className="divide-y">
      {parties.map((p) => (
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
                setBookmarkList(
                  bookmarkList.includes(p.id)
                    ? bookmarkList.filter((id) => id !== p.id)
                    : [...bookmarkList, p.id]
                );
                e.stopPropagation();
              }}
              aria-label="Merken"
            >
              <Bookmark
                className={`size-8 transition ${bookmarkList.includes(p.id) ? "fill-current" : "fill-transparent hover:fill-current/25"}`}
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
