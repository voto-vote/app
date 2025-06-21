"use client";

import { Progress } from "@/components/ui/progress";
import { Bookmark, ChevronRight } from "lucide-react";
import Image from "next/image";
import { mockCandidates } from "./mock";

export default function CandidatesList({
  candidates,
  bookmarkList,
  setBookmarkList,
}: {
  candidates: typeof mockCandidates;
  bookmarkList: string[];
  setBookmarkList: (ids: string[]) => void;
}) {
  return (
    <div className="divide-y">
      {candidates.map((c) => (
        <div key={c.id} className="flex items-center gap-4 py-4">
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
            <div className="mt-2 relative">
              <Progress value={c.match} className="h-4 rounded-sm" />
              <div
                className="absolute inset-y-0 text-primary-foreground text-sm font-semibold leading-none pr-0.5"
                style={{ right: 100 - c.match + "%" }}
              >
                {c.match}%
              </div>
            </div>
          </div>
          <div className="text-votopurple flex items-center">
            <button
              onClick={() =>
                setBookmarkList(
                  bookmarkList.includes(c.id)
                    ? bookmarkList.filter((id) => id !== c.id)
                    : [...bookmarkList, c.id]
                )
              }
              aria-label="Merken"
            >
              <Bookmark
                className={`size-8 transition ${bookmarkList.includes(c.id) ? "fill-current" : "fill-transparent hover:fill-current/25"}`}
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
