"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
//import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useElectionStore } from "@/stores/election-store";
import { useBackButtonStore } from "@/stores/back-button-store";
import CandidatesList from "./candidates-list";
import PartiesList from "./parties-list";
import FilterDialog from "./filter-dialog";
import { mockCandidates, mockParties } from "./mock";
import { useRatingsStore } from "@/stores/ratings-store";
import { useRouter } from "@/i18n/navigation";

export default function ResultsList() {
  const [tab, setTab] = useState<"candidates" | "parties">("candidates");
  const [bookmarkList, setBookmarkList] = useState(["1", "3", "cdu", "spd"]);
  const [filterOpen, setFilterOpen] = useState(false);
  //const t = useTranslations("ResultsPage");
  const { election } = useElectionStore();
  const { setBackPath } = useBackButtonStore();
  const { ratings } = useRatingsStore();
  const router = useRouter();

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}/theses`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  if (!election) return null;

  return (
    <div className="container mx-auto max-w-3xl p-2 pb-14">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm max-w-1/2">
            Auf Basis Deiner{" "}
            {Object.values(ratings[election.id] ?? {}).reduce(
              (n, r) => (r.rating ? n + 1 : n),
              0
            )}{" "}
            beantworteten Thesen zur Wahl {election.title} {election.subtitle}{" "}
            {new Date(election.date).getFullYear()}
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
              bookmarkList={bookmarkList}
              setBookmarkList={setBookmarkList}
              onCandidateClick={(id) =>
                router.push(`/elections/${election.id}/result/candidates/${id}`)
              }
            />
          )}
          {tab === "parties" && (
            <PartiesList
              parties={mockParties}
              bookmarkList={bookmarkList}
              setBookmarkList={setBookmarkList}
              onPartyClick={(id) =>
                router.push(`/elections/${election.id}/result/parties/${id}`)
              }
            />
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-accent z-10 border-t">
        <div className="container mx-auto max-w-3xl flex items-center justify-between py-2">
          <Button
            variant="ghost"
            className="text-primary text-base"
            onClick={() => setFilterOpen(true)}
          >
            Filter
          </Button>
          <Button variant="ghost" className="text-primary text-base">
            Merkliste ({bookmarkList.length})
          </Button>
        </div>
      </div>

      <FilterDialog open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  );
}
