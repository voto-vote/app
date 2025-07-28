"use client";

import { Button } from "@/components/ui/button";
import MatchBar from "@/app/[locale]/elections/[electionid]/(theses)/result/match-bar";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useThesesStore } from "@/stores/theses-store";
import { useRatingsStore } from "@/stores/ratings-store";
import { useElection } from "@/contexts/election-context";
import ThesesResultCarousel from "../thesis-result-carousel";
import { Bookmark } from "@/components/icons/bookmark";
import LegendBottomBar from "../legend-bottom-bar";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { motion, AnimatePresence } from "framer-motion";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useTranslations } from "next-intl";

type Party = {
  id: string;
  name: string;
  image: string;
  description: string;
};

type Candidate = {
  id: string;
  name: string;
  image: string;
  description: string;
  aboutMe: string;
  party: Party;
};

interface CandidateOrPartyProps {
  participant: Party | Candidate;
}

export default function CandidateOrParty({
  participant,
}: CandidateOrPartyProps) {
  const { bookmarks, toggleCandidate, toggleParty } = useBookmarkStore();
  const [isAboutMeExpanded, setIsAboutMeExpanded] = useState(false);
  const [aboutMeRef, setAboutMeRef] = useState<HTMLDivElement | null>(null);
  const [aboutMeHeight, setAboutMeHeight] = useState(0);
  const [showTopBar, setShowTopBar] = useState(false);
  const { election } = useElection();
  const { theses } = useThesesStore();
  const { ratings, setRating, setFavorite } = useRatingsStore();
  const { setBackPath } = useBackButtonStore();
  const isDesktop = useBreakpoint("md");
  const type = participant.hasOwnProperty("aboutMe") ? "candidate" : "party";
  const t = useTranslations("CandidateOrParty");

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}/result`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const el = event.currentTarget as HTMLElement;
      setShowTopBar(el.scrollTop > 180);
    };

    const mainElement = document.getElementsByTagName("main")[0];
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (aboutMeRef) {
      setAboutMeHeight(aboutMeRef.scrollHeight);
    }
  }, [aboutMeRef]);

  if (!theses) {
    return null;
  }

  function toggleBookmark() {
    if (type === "candidate") {
      toggleCandidate(election.id, participant.id);
    } else {
      toggleParty(election.id, participant.id);
    }
  }

  function isBookmarked() {
    if (type === "candidate") {
      return (bookmarks[election.id]?.candidates || []).includes(
        participant.id
      );
    } else {
      return (bookmarks[election.id]?.parties || []).includes(participant.id);
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Sticky Top Bar */}
      <AnimatePresence>
        {showTopBar && (
          <motion.div
            initial={{ y: -65 }}
            animate={{ y: 0 }}
            exit={{ y: -65 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-14 left-0 right-0 z-40 backdrop-blur-md bg-accent/50 border-b border-zinc-300 flex items-center p-2"
          >
            <div className="flex items-center gap-3 w-full max-w-3xl mx-auto">
              <div
                className={`h-12 w-fit overflow-hidden ${type === "candidate" ? "rounded-full" : "rounded"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={participant.image}
                  alt={t("logoOrAvatar")}
                  className="object-contain h-full"
                />
              </div>
              <div className="grow space-y-[0.125rem]">
                <div className="font-bold text-base leading-none">
                  {participant.name}
                </div>
                <div className="text-xs">CDU | S-Nord | #6</div>
                <MatchBar value={60} size="sm" />
              </div>
              <button aria-label={t("bookmark")} onClick={toggleBookmark}>
                <Bookmark
                  className={`size-7 transition stroke-1 ${isBookmarked() ? "fill-primary stroke-primary" : "fill-muted stroke-muted-foreground/25 hover:fill-muted-foreground/15"}`}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-3xl px-2 pb-16 space-y-8">
        {/* Header */}
        <div className="-mx-2 md:mx-0 relative">
          <div
            className="h-24 md:h-36 bg-cover bg-center"
            style={{ backgroundImage: `url(${election.image})` }}
          ></div>
          <div
            className={`absolute left-1/2 md:left-2 -translate-x-1/2 md:translate-x-0 top-6 md:top-18 h-38 w-fit border-4 border-background overflow-hidden ${type === "candidate" ? "rounded-full" : "rounded"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={participant.image}
              alt={t("logoOrAvatar")}
              className="object-contain h-full"
            />
          </div>
          <div className="flex items-center justify-end md:justify-baseline md:ml-42 p-4">
            {isDesktop && <MatchBar value={60} className="grow" />}
            <button
              onClick={toggleBookmark}
              className="ml-4"
              aria-label={t("bookmark")}
            >
              <Bookmark
                className={`size-8 transition stroke-1 ${isBookmarked() ? "fill-primary stroke-primary" : "fill-muted stroke-muted-foreground/25 hover:fill-muted-foreground/15"}`}
              />
            </button>
          </div>
        </div>

        {/* Candidate Info */}
        <div>
          <h1 className="text-xl font-bold">{participant.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 text-lg">
              {participant.description}
            </div>
            {!isDesktop && <MatchBar value={60} />}
            <div className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-6">
              <div className="font-bold text-sm">
                {t("list")}
                <br />
                {t("position")}
                <br />
                {t("region")}
              </div>
              <div className="text-sm">
                CDU
                <br />
                6
                <br />
                Stuttgart-Nord
              </div>
            </div>
          </div>
        </div>

        {/* About me */}
        {"aboutMe" in participant && (
          <div>
            <h2 className="text-lg font-bold">{t("aboutMe")}</h2>
            <div
              className="md:grid md:grid-cols-6 overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: isAboutMeExpanded ? `${aboutMeHeight}px` : "7.5rem",
              }}
            >
              <div className="col-span-4" ref={setAboutMeRef}>
                {participant.aboutMe}
              </div>
            </div>

            {/* Gradient overlay when collapsed */}
            {!isAboutMeExpanded && (
              <div className="h-6 bg-gradient-to-t from-background to-transparent -mt-6 relative z-10" />
            )}

            <Button
              variant="ghost"
              className="text-primary text-sm -ml-3"
              onClick={() => setIsAboutMeExpanded(!isAboutMeExpanded)}
            >
              {t("details")}
              <ChevronDown
                className={`transition ${isAboutMeExpanded ? "rotate-180" : "rotate-0"}`}
              />
            </Button>
          </div>
        )}

        {/* Theses */}
        <div className="mb-0">
          <h2 className="text-lg font-bold">
            {t("votoAnswers", { participant: participant.name })}
          </h2>

          <ThesesResultCarousel
            election={election}
            theses={theses}
            ratings={ratings[election.id]}
            onRatingChange={(thesisId, newRating) => {
              if (newRating.rating !== undefined) {
                setRating(election.id, thesisId, newRating.rating);
              }
              setFavorite(election.id, thesisId, newRating.favorite);
            }}
          />
        </div>

        {/* Bottom Bar Legend */}
        <LegendBottomBar election={election} />
      </div>
    </div>
  );
}
