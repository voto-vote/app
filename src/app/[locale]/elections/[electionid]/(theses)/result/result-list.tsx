"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import CandidatesList from "./candidates-list";
import PartiesList from "./parties-list";
import FilterDialog from "./filter-dialog";
import { useRatingsStore } from "@/stores/ratings-store";
import { useRouter } from "@/i18n/navigation";
import { useElection } from "@/contexts/election-context";
import BottomBar from "./bottom-bar";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useTranslations } from "next-intl";
import { useThesesStore } from "@/stores/theses-store";
import { useResultStore } from "@/stores/result-store";
import { usePartiesStore } from "@/stores/party-store";

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
  const { ratings } = useRatingsStore();
  const { results } = useResultStore();
  const { parties } = usePartiesStore();
  const { bookmarks, toggleCandidate, toggleParty } = useBookmarkStore();
  const router = useRouter();
  const t = useTranslations("ResultList");

  if (!theses || !parties) {
    return null;
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
          <p className="text-sm md:max-w-1/2">
            {t("explanation", {
              count: Object.values(ratings[election.id] ?? {}).reduce(
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
            <CandidatesList
              results={results}
              parties={parties}
              bookmarked={bookmarks[election.id]?.candidates || []}
              onBookmarkToggle={(id) => toggleCandidate(election.id, id)}
              filterBookmarked={filterBookmarked}
              onCandidateClick={(id) =>
                router.push(`/elections/${election.id}/result/candidates/${id}`)
              }
            />
          )}
          {tab === "parties" && (
            <PartiesList
              results={results}
              bookmarked={bookmarks[election.id]?.parties || []}
              onBookmarkToggle={(id) => toggleParty(election.id, id)}
              filterBookmarked={filterBookmarked}
              onPartyClick={(id) =>
                router.push(`/elections/${election.id}/result/parties/${id}`)
              }
            />
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomBar>
        <Button variant="ghost" onClick={() => setFilterOpen(true)}>
          {t("filterButton")}
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
        open={filterOpen}
        onOpenChange={setFilterOpen}
      />
    </div>
  );
}
