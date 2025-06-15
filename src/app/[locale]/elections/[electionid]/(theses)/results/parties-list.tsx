"use client";

import { Progress } from "@/components/ui/progress";
import { mockParties } from "./page";
import { Bookmark, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";

export default function PartiesList({
  parties,
  bookmarkList,
  setBookmarkList,
}: {
  parties: typeof mockParties;
  bookmarkList: string[];
  setBookmarkList: (ids: string[]) => void;
}) {
  return (
    <div className="divide-y">
      {parties.map((p) => (
        <div key={p.id} className="flex items-center gap-4 py-4">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate">{p.name}</div>
            <div className="mt-2 relative">
              <Progress
                value={p.match}
                className="h-4 rounded-sm"
                style={{ "--primary": p.color } as CSSProperties}
              />
              <div
                className="absolute inset-y-0 text-primary-foreground text-sm font-semibold leading-none pr-0.5"
                style={{ right: 100 - p.match + "%" }}
              >
                {p.match}%
              </div>
            </div>
          </div>
          <div className="text-votopurple flex items-center">
            <button
              onClick={() =>
                setBookmarkList(
                  bookmarkList.includes(p.id)
                    ? bookmarkList.filter((id) => id !== p.id)
                    : [...bookmarkList, p.id]
                )
              }
              aria-label="Merken"
            >
              <Bookmark
                className={`size-8 transition ${bookmarkList.includes(p.id) ? "fill-current" : "fill-transparent hover:fill-current/25"}`}
              />
            </button>
            <button>
              <ChevronRight className="size-10" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
