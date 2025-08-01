"use client";

import MatchBar from "@/app/[locale]/elections/[electionid]/(theses)/result/match-bar";
import { Fragment, useEffect, useState } from "react";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useThesesStore } from "@/stores/theses-store";
import { useUserRatingsStore } from "@/stores/user-ratings-store";
import { useElection } from "@/contexts/election-context";
import ThesesResultCarousel from "../thesis-result-carousel";
import { Bookmark } from "@/components/icons/bookmark";
import LegendBottomBar from "../legend-bottom-bar";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { motion, AnimatePresence } from "framer-motion";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Result } from "@/types/result";

interface CandidateOrPartyProps {
  result: Result;
}

export default function CandidateOrParty({ result }: CandidateOrPartyProps) {
  const { bookmarks, toggleCandidate, toggleParty } = useBookmarkStore();
  const [showTopBar, setShowTopBar] = useState(false);
  const { election } = useElection();
  const { theses } = useThesesStore();
  const { userRatings, setUserRating, setUserFavorite } = useUserRatingsStore();
  const { setBackPath } = useBackButtonStore();
  const isDesktop = useBreakpoint("md");
  const entity = result.entity;
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

  if (!theses) {
    return null;
  }

  function toggleBookmark() {
    if (entity.type === "candidate") {
      toggleCandidate(election.id, entity.id);
    } else {
      toggleParty(election.id, entity.id);
    }
  }

  function isBookmarked() {
    if (entity.type === "candidate") {
      return (bookmarks[election.id]?.candidates || []).includes(entity.id);
    } else {
      return (bookmarks[election.id]?.parties || []).includes(entity.id);
    }
  }

  const items: Map<string, string> = new Map();
  if (entity.type === "candidate") {
    if (entity.partyName) {
      items.set("party", entity.partyName);
    }
    if (entity.district && entity.district !== "-1") {
      items.set("region", entity.district);
    }
    if (entity.listPlace && entity.listPlace !== -1) {
      items.set("position", "#" + entity.listPlace);
    }
  }
  if (entity.type === "party") {
    if (entity.detailedName) {
      items.set("detailedName", entity.detailedName);
    }
    if (entity.website) {
      items.set("website", entity.website.toString());
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
            className="fixed top-14 left-0 right-0 z-30 backdrop-blur-md bg-accent/50 border-b border-zinc-300 flex items-center p-2"
          >
            <div className="flex items-center gap-3 w-full max-w-3xl mx-auto">
              <div
                className={`h-12 w-fit overflow-hidden ${entity.type === "candidate" ? "rounded-full" : "rounded"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entity.image}
                  alt={t("logoOrAvatar")}
                  className="object-contain h-full"
                />
              </div>
              <div className="min-w-0 grow space-y-[0.125rem]">
                <div className="font-bold text-base leading-none">
                  {entity.displayName}
                </div>
                <div className="text-xs truncate">
                  {items.values().toArray().join(" | ")}
                </div>
                <MatchBar color={result.entity.color} value={result.matchPercentage} size="sm" />
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
            className={`absolute left-1/2 md:left-2 -translate-x-1/2 md:translate-x-0 top-6 md:top-18 h-38 w-fit border-4 border-background overflow-hidden ${entity.type === "candidate" ? "rounded-full" : "rounded"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entity.image}
              alt={t("logoOrAvatar")}
              className="object-contain h-full"
            />
          </div>
          <div className="flex items-center justify-end md:justify-baseline md:ml-42 p-4">
            {isDesktop && (
              <MatchBar color={result.entity.color} value={result.matchPercentage} className="grow" />
            )}
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
          <h1 className="text-xl font-bold">{entity.displayName}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 text-lg">{entity.description}</div>
            {!isDesktop && <MatchBar color={result.entity.color} value={result.matchPercentage} />}
            <div className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:grid-cols-2 h-fit gap-x-2">
              {items
                .entries()
                .toArray()
                .map(([key, value]) => (
                  <Fragment key={key}>
                    <span className="font-bold text-sm">{t(key)}</span>
                    {key === "website" ? (
                      <Link
                        href={value}
                        target="_blank"
                        className="text-sm hover:underline"
                      >
                        {value}
                      </Link>
                    ) : (
                      <span className="text-sm">{value}</span>
                    )}
                  </Fragment>
                ))}
            </div>
          </div>
        </div>

        {/* Theses */}
        <div className="mb-0">
          <h2 className="text-lg font-bold">
            {t("votoAnswers", { name: entity.displayName })}
          </h2>

          <ThesesResultCarousel
            election={election}
            theses={theses}
            userRatings={userRatings[election.id] ?? {}}
            entities={[entity]}
            onRatingChange={(thesisId, newRating) => {
              if (newRating.rating !== undefined) {
                setUserRating(election.id, thesisId, newRating.rating);
              }
              setUserFavorite(election.id, thesisId, newRating.favorite);
            }}
          />
        </div>

        {/* Bottom Bar Legend */}
        <LegendBottomBar election={election} />
      </div>
    </div>
  );
}
