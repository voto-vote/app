"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
//import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useElectionStore } from "@/stores/election-store";
import { useBackButtonStore } from "@/stores/back-button-store";
import CandidatesList from "./candiates-list";
import PartiesList from "./parties-list";
import Filter from "./filter";

// Mock data for demonstration
export const mockCandidates = [
  {
    id: "1",
    name: "Janka Kluge",
    party: "SPD",
    list: "Stuttgart-West",
    listNumber: "#1",
    image: "/profile1.jpg",
    match: 74,
    bookmarked: true,
  },
  {
    id: "2",
    name: "Sarah Suschanek",
    party: "Bündnis 90 / Die Grünen",
    list: "Stuttgart-Plieningen",
    listNumber: "#4",
    image: "/profile2.jpg",
    match: 69,
    bookmarked: false,
  },
  {
    id: "3",
    name: "Filippo Cappezzone",
    party: "Die Linke",
    list: "Stuttgart-Nord",
    listNumber: "#9",
    image: "/profile3.jpg",
    match: 60,
    bookmarked: true,
  },
  {
    id: "4",
    name: "Brigitte Burn-Müllhaupt",
    party: "CDU",
    list: "Stuttgart-Nord",
    listNumber: "#6",
    image: "/profile4.jpg",
    match: 60,
    bookmarked: false,
  },
  {
    id: "5",
    name: "Max Mustermann",
    party: "MUPA",
    list: "Stuttgart-Muster",
    listNumber: "#99",
    image: "/profile5.jpg",
    match: 57,
    bookmarked: false,
  },
  {
    id: "6",
    name: "Jean Dupont",
    party: "MUPA",
    list: "Stuttgart-Muster",
    listNumber: "#98",
    image: "/profile6.jpg",
    match: 56,
    bookmarked: false,
  },
];

export const mockParties = [
  {
    id: "spd",
    name: "SPD",
    match: 74,
    color: "#E3000F",
    bookmarked: true,
  },
  {
    id: "gruene",
    name: "Bündnis 90 / Die Grünen",
    match: 69,
    color: "#46962b",
    bookmarked: false,
  },
  {
    id: "linke",
    name: "Die Linke",
    match: 66,
    color: "#BE3075",
    bookmarked: false,
  },
  {
    id: "cdu",
    name: "CDU",
    match: 60,
    color: "#000000",
    bookmarked: true,
  },
  {
    id: "fdp",
    name: "FDP",
    match: 57,
    color: "#FFD600",
    bookmarked: false,
  },
];

export default function ResultsPage() {
  const [tab, setTab] = useState<"candidates" | "parties">("candidates");
  const [bookmarkList, setBookmarkList] = useState(["1", "3", "cdu", "spd"]);
  const [filterOpen, setFilterOpen] = useState(false);
  //const t = useTranslations("ResultsPage");
  const { election } = useElectionStore();
  const { setBackPath } = useBackButtonStore();

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}/theses`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  if (!election) return null;

  // For demonstration, we use mock data and mock translation keys.
  // In production, fetch and translate real data.

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
            Auf Basis Deiner 30 beantworteten Thesen zur Wahl des Gemeinderats
            Musterstadt 2025
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)}>
          <TabsList className="border w-full">
            <TabsTrigger
              value="candidates"
              className={`text-lg transition-all
                ${tab === "candidates" ? "text-votopurple font-semibold" : "text-votopurple/70"}`}
            >
              Kandidierende
            </TabsTrigger>
            <TabsTrigger
              value="parties"
              className={`text-lg transition-all
                ${tab === "parties" ? "text-votopurple font-semibold" : "text-votopurple/70"}`}
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
            />
          )}
          {tab === "parties" && (
            <PartiesList
              parties={mockParties}
              bookmarkList={bookmarkList}
              setBookmarkList={setBookmarkList}
            />
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-accent z-10 border-t">
        <div className="container mx-auto max-w-3xl flex items-center justify-between py-2">
          <Button
            variant="ghost"
            className="text-votopurple text-base"
            onClick={() => setFilterOpen(true)}
          >
            Filter
          </Button>
          <Button variant="ghost" className="text-votopurple text-base">
            Merkliste ({bookmarkList.length})
          </Button>
        </div>
      </div>

      <Filter open={filterOpen} onOpenChange={setFilterOpen}></Filter>
    </div>
  );
}
