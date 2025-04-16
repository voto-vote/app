"use client";

import { useStore } from "@/store";
import { ChevronLeft, Menu, QrCode } from "lucide-react";
import ShareDrawer from "./share-drawer";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import NavigationSheet from "./navigation-sheet";
import { useBackButton } from "@/contexts/BackButtonContext";
import { AnimatePresence, motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import Link from "next/link";

export default function Header() {
  const { electionid, runid } = useParams<{
    electionid: string;
    runid: string;
  }>();
  const { election } = useStore();
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [navigationSheetOpen, setNavigationSheetOpen] = useState(false);
  const router = useRouter();
  const { backPath } = useBackButton();
  const isDesktop = useBreakpoint("md");

  return (
    <header className="bg-votopurple text-white">
      <div className="container mx-auto max-w-screen-xl p-2 grid grid-cols-[6rem_auto_6rem] items-center overflow-hidden min-h-14">
        <div className="justify-self-start">
          <button className="p-2 rounded-full hover:bg-primary/50 transition-colors">
            <ChevronLeft
              className="size-6"
              onClick={() => (backPath ? router.push(backPath) : router.back())}
            />
          </button>
        </div>
        {isDesktop && (
          <div
            className={`relative h-full flex items-center ${electionid ? "justify-between" : "justify-center"}`}
          >
            <AnimatePresence mode="popLayout">
              {election && electionid && (
                <motion.div
                  key="election-info"
                  initial={{ opacity: 0, x: -20, width: "0" }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -20, width: "0" }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    href={`/elections/${electionid}`}
                    className="flex gap-8 items-center"
                  >
                    <div>
                      <div className="font-bold text-lg leading-none">
                        {election.date.toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                      <div className="text-sm leading-none">
                        {election.date.getFullYear()}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-lg leading-none">
                        {election.location}
                      </div>
                      <div className="text-sm leading-none">
                        {election.name}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
              <motion.div
                key="logo"
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Link href="/">
                  <Image
                    src="/logo-dark.svg"
                    className="h-6"
                    alt="Voto"
                    width={55}
                    height={24}
                    priority
                  />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        {!isDesktop && (
          <div
            className={`relative h-full flex items-center justify-center transition-all`}
          >
            <AnimatePresence mode="sync">
              {election &&
                electionid /*TODO remove electionid if real data is present*/ && (
                  <motion.div
                    key="election-info"
                    className="absolute inset-0 text-center mt-1"
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    exit={{ y: 50 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Link href={`/elections/${electionid}`}>
                      <div className="-mt-[0.25rem]">
                        <FormattedDate date={election.date} locale="de" />
                      </div>
                      <p className="text-xs -mt-[0.25rem]">
                        {election.location} {election.name}
                      </p>
                    </Link>
                  </motion.div>
                )}
              {
                /*!election*/ !electionid /*TODO remove electionid if real data is present*/ && (
                  <motion.div
                    key="logo"
                    className="absolute top-0 bottom-0 left-1/2 -translate-x-[50%]"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    exit={{ y: -50 }}
                    transition={{
                      duration: 0.5,
                      transition: { ease: "easeOut" },
                    }}
                  >
                    <Link href="/">
                      <Image
                        src="/logo-dark.svg"
                        alt="Voto"
                        className="h-6 my-2"
                        width={55}
                        height={24}
                        priority
                      />
                    </Link>
                  </motion.div>
                )
              }
            </AnimatePresence>
          </div>
        )}
        <div className="flex gap-1 justify-self-end">
          <AnimatePresence mode="wait">
            {runid && (
              <motion.button
                className="p-2 rounded-full hover:bg-primary/50 transition-colors"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <QrCode
                  className="size-6"
                  onClick={() => setShareDrawerOpen(true)}
                />
              </motion.button>
            )}
          </AnimatePresence>
          <button className="p-2 rounded-full hover:bg-primary/50 transition-colors">
            <Menu
              className="size-6"
              onClick={() => setNavigationSheetOpen(true)}
            />
          </button>
        </div>
      </div>
      <ShareDrawer open={shareDrawerOpen} onOpenChange={setShareDrawerOpen} />
      <NavigationSheet
        open={navigationSheetOpen}
        onOpenChange={setNavigationSheetOpen}
      />
    </header>
  );
}

function FormattedDate({
  date,
  locale = "en-US",
}: {
  date: string | Date;
  locale?: string;
}) {
  if (!date) return null;

  const dateObj = new Date(date);

  // Get the individual parts of the date
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(dateObj);

  // Create JSX elements with bold formatting for day and month and uppercase for month
  return (
    <span>
      {parts.map((part, index) => {
        return (
          <span key={index} className="font-bold uppercase text-xs">
            {part.value}
          </span>
        );
      })}
    </span>
  );
}
