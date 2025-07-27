"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import CandidatesList from "./candidates-list";
import PartiesList from "./parties-list";
import FilterDialog from "./filter-dialog";
import { mockCandidates, mockParties } from "./mock";
import { useRatingsStore } from "@/stores/ratings-store";
import { useRouter } from "@/i18n/navigation";
import { useElection } from "@/contexts/election-context";
import BottomBar from "./bottom-bar";
import { useBookmarkStore } from "@/stores/bookmark-store";

interface ResultListProps {
  filterBookmarked: boolean;
  setFilterBookmarked: (value: boolean) => void;
}

export default function ResultList({
  filterBookmarked,
  setFilterBookmarked,
}: ResultListProps) {
  const [tab, setTab] = useState<"candidates" | "parties">("candidates");
  const [filterOpen, setFilterOpen] = useState(false);
  const { election } = useElection();
  const { ratings } = useRatingsStore();
  const { bookmarks, toggleCandidate, toggleParty } = useBookmarkStore();
  const router = useRouter();

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
            Auf Basis Deiner{" "}
            {Object.values(ratings[election.id] ?? {}).reduce(
              (n, r) => (r.rating ? n + 1 : n),
              0
            )}{" "}
            beantworteten Thesen zur Wahl {election.title} {election.subtitle}{" "}
            {new Date(election.electionDate).getFullYear()}
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)}>
          <TabsList className="border w-full">
            <TabsTrigger
              value="candidates"
              className={`text-lg transition-all
                ${tab === "candidates" ? "text-primary font-semibold" : "text-primary/70"}`}
            >
              Kandidierende
            </TabsTrigger>
            <TabsTrigger
              value="parties"
              className={`text-lg transition-all
                ${tab === "parties" ? "text-primary font-semibold" : "text-primary/70"}`}
            >
              Parteien
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tab Content */}
        <div>
          {tab === "candidates" && (
            <CandidatesList
              candidates={mockCandidates}
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
              parties={mockParties}
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
          Filter
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
          Merkliste (
          {(bookmarks[election.id]?.parties?.length ?? 0) +
            (bookmarks[election.id]?.candidates?.length ?? 0)}
          )
        </Button>
      </BottomBar>

      <FilterDialog open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  );
}
