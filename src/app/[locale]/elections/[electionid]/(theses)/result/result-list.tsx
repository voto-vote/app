"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import FilterDialog from "./filter-dialog";
import { useUserRatingsStore } from "@/stores/user-ratings-store";
import { useRouter } from "@/i18n/navigation";
import { useElection } from "@/contexts/election-context";
import BottomBar from "./bottom-bar";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useTranslations } from "next-intl";
import { useThesesStore } from "@/stores/theses-store";
import { useResultStore } from "@/stores/result-store";
import CandidatesOrPartiesList from "./candidates-or-parties-list";
import { Candidate } from "@/types/candidate";
import { useEntityFilterStore } from "@/stores/entity-filter-store";
import { useSearchParams } from "next/navigation";

interface ResultListProps {
  filterBookmarked: boolean;
  setFilterBookmarked: (value: boolean) => void;
}

export default function ResultList({
  filterBookmarked,
  setFilterBookmarked,
}: ResultListProps) {
  const { election } = useElection();
  const [tab, setTab] = useState<"candidates" | "parties">(
    election.algorithm.matchType === "parties" ? "parties" : "candidates"
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const { theses } = useThesesStore();
  const { userRatings } = useUserRatingsStore();
  const { results } = useResultStore();
  const { bookmarks, toggleCandidate, toggleParty } = useBookmarkStore();
  const { entityFilters } = useEntityFilterStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("ResultList");

  if (!theses) {
    return null;
  }

  function pushWithData(id: number, type: "candidates" | "parties") {
    let path = `/elections/${election.id}/result/${type}/${id}`;
    const data = searchParams.get("data");
    if (data) {
      path += `?data=${data}`;
    }
    router.push(path);
  }

  return (
    <div className="container mx-auto max-w-3xl p-2 pb-13">
      <div className="space-y-4 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-semibold mt-4">
            {t("explanation", {
              count: Object.values(userRatings[election.id] ?? {}).reduce(
                (n, r) => ((r.rating ?? 0 > 0) ? n + 1 : n),
                0
              ),
              electionTitle: election.title,
              electionSubtitle: election.subtitle,
            })}
          </p>
        </motion.div>

        {/* Tabs */}
        {election.algorithm.matchType === "candidates-and-parties" && (
          <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)}>
            <TabsList className="border w-full">
              <TabsTrigger
                value="candidates"
                className={`text-lg transition-all
                ${tab === "candidates" ? "text-primary font-semibold" : "text-primary/70"}`}
              >
                {t("candidatesTab")}
              </TabsTrigger>
              <TabsTrigger
                value="parties"
                className={`text-lg transition-all
                ${tab === "parties" ? "text-primary font-semibold" : "text-primary/70"}`}
              >
                {t("partiesTab")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Tab Content */}
        <div>
          {tab === "candidates" && (
            <CandidatesOrPartiesList
              election={election}
              result={
                election.algorithm.matchType === "candidates"
                  ? results
                  : results.filter((r) => r.entity.type === "candidate")
              }
              bookmarked={bookmarks[election.id]?.candidates || []}
              onBookmarkToggle={(id) => toggleCandidate(election.id, id)}
              filterBookmarked={filterBookmarked}
              filters={Object.values(entityFilters).map((f) => f.condition)}
              onClick={(id) => pushWithData(id, "candidates")}
            />
          )}
          {tab === "parties" && (
            <CandidatesOrPartiesList
              election={election}
              result={
                election.algorithm.matchType === "parties"
                  ? results
                  : results.filter((r) => r.entity.type === "party")
              }
              bookmarked={bookmarks[election.id]?.parties || []}
              onBookmarkToggle={(id) => toggleParty(election.id, id)}
              filterBookmarked={filterBookmarked}
              filters={Object.values(entityFilters).map((f) => f.condition)}
              onClick={(id) => pushWithData(id, "parties")}
            />
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomBar>
        <Button variant="ghost" onClick={() => setFilterOpen(true)}>
          {t("filterButton", {
            count: Object.keys(entityFilters).length.toString(),
          })}
        </Button>
        <Button
          variant="ghost"
          className={
            filterBookmarked
              ? "!bg-primary !text-primary-foreground !hover:text-primary-foreground"
              : ""
          }
          onClick={() => setFilterBookmarked(!filterBookmarked)}
        >
          {t("bookmarksButton", {
            count:
              (bookmarks[election.id]?.parties?.length ?? 0) +
              (bookmarks[election.id]?.candidates?.length ?? 0),
          })}
        </Button>
      </BottomBar>

      <FilterDialog
        election={election}
        theses={theses}
        candidates={results
          .filter((r) => r.entity.type === "candidate")
          .map((r) => r.entity as Candidate)}
        userRatings={userRatings[election.id] || {}}
        open={filterOpen}
        onOpenChange={setFilterOpen}
      />
    </div>
  );
}
