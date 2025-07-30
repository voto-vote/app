import { Result } from "@/types/result";
import MatchBar from "./match-bar";
import { Bookmark } from "@/components/icons/bookmark";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Entity } from "@/types/entity";
import { usePointer } from "@/hooks/use-pointer";
import { Election } from "@/types/election";

interface CandidatesOrPartiesListProps {
  election: Election;
  result: Result[];
  bookmarked: number[];
  onBookmarkToggle: (id: number) => void;
  filterBookmarked?: boolean;
  filters: ((entity: Entity) => boolean)[];
  onClick: (id: number) => void;
}

export default function CandidatesOrPartiesList({
  election,
  result,
  bookmarked,
  onBookmarkToggle,
  filterBookmarked,
  filters,
  onClick,
}: CandidatesOrPartiesListProps) {
  const isCoarsePointer = usePointer();
  const t = useTranslations("CandidatesOrPartiesList");
  const items = result
    .filter((r) => !filterBookmarked || bookmarked.includes(r.entity.id))
    .filter((r) => filters.every((f) => f(r.entity)));

  function getAdditionalInfos(result: Result): Map<string, string> {
    const items: Map<string, string> = new Map();
    if (result.entity.type === "candidate") {
      if (result.entity.partyName) {
        items.set("party", result.entity.partyName);
      }
      if (result.entity.district) {
        items.set("region", result.entity.district);
      }
      if (result.entity.listPlace) {
        items.set("position", "#" + result.entity.listPlace);
      }
    }
    if (result.entity.type === "party") {
      if (result.entity.detailedName) {
        items.set("detailedName", result.entity.detailedName);
      }
    }
    return items;
  }

  return (
    <>
      {items.length > 0 && (
        <div className="divide-y">
          {items.map((r) => {
            return (
              <div
                key={r.entity.id}
                onClick={() => onClick(r.entity.id)}
                className="w-full text-start flex items-center gap-4 py-4 hover:bg-accent transition-colors cursor-pointer"
              >
                {r.entity.type === "candidate" && (
                  <Image
                    src={r.entity.image}
                    alt={r.entity.displayName}
                    width={64}
                    height={64}
                    className="rounded-full object-cover size-16 border"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold md:text-lg truncate">
                    {r.entity.displayName}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground truncate">
                    {getAdditionalInfos(r).values().toArray().join(" | ")}
                  </div>
                  <MatchBar
                    value={r.matchPercentage}
                    color={
                      r.entity.type === "party" ? r.entity.color : undefined
                    }
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
      )}
      {items.length === 0 && bookmarked.length === 0 && filterBookmarked && (
        <div className="text-center text-xl pt-8">
          {t("noBookmarks", {
            pointer: isCoarsePointer ? "coarse" : "fine",
            matchType: election.algorithm.matchType,
          })}
        </div>
      )}
      {items.length === 0 && filters.length > 0 && (
        <div className="text-center text-xl pt-8">
          {t("tooManyFilters", {
            matchType: election.algorithm.matchType,
          })}
        </div>
      )}
    </>
  );
}
