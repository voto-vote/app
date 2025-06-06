"use client";

import { ChevronLeft, Menu, QrCode } from "lucide-react";
import ShareDrawer from "./share-drawer";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import NavigationSheet from "./navigation-sheet";
import { AnimatePresence, motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useElectionStore } from "@/stores/election-store";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function Header() {
  const { runid } = useParams<{
    runid: string;
  }>();
  const backPath = useBackButtonStore((state) => state.backPath);
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [navigationSheetOpen, setNavigationSheetOpen] = useState(false);
  const router = useRouter();
  const isDesktop = useBreakpoint("md");
  const election = useElectionStore((state) => state.election);
  const locale = useLocale();

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
            className={`relative h-full flex items-center ${election ? "justify-between" : "justify-center"}`}
          >
            <AnimatePresence mode="popLayout">
              {election && (
                <motion.div
                  key="election-info"
                  initial={{ opacity: 0, x: -20, width: "0" }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -20, width: "0" }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    href={`/elections/${election.id}`}
                    className="flex gap-8 items-center"
                  >
                    <div>
                      <div className="font-bold text-lg leading-none">
                        {new Date(election.date).toLocaleDateString(locale, {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                      <div className="text-sm leading-none">
                        {new Date(election.date).toLocaleDateString(locale, {
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-lg leading-none">
                        {election.title}
                      </div>
                      <div className="text-sm leading-none">
                        {election.subtitle}
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
            className={`h-full flex items-center justify-center transition-all`}
          >
            <AnimatePresence mode="wait">
              {election && (
                <motion.div
                  key="election-info"
                  className="grid place-items-center text-center"
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  exit={{ y: 50 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Link href={`/elections/${election.id}`}>
                    <div className="font-bold text-xs leading-none">
                      {new Date(election.date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </div>
                    <p className="text-xs leading-none">
                      {election.title} {election.subtitle}
                    </p>
                  </Link>
                </motion.div>
              )}
              {!election && (
                <motion.div
                  key="logo"
                  className="grid place-items-center"
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
                      className="h-6"
                      width={55}
                      height={24}
                      priority
                    />
                  </Link>
                </motion.div>
              )}
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
