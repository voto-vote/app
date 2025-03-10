"use client";

import { useStore } from "@/store";
import { ChevronLeft, Menu, QrCode } from "lucide-react";
import ShareDrawer from "./share-drawer";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import NavigationSheet from "./navigation-sheet";

export default function Header() {
  const { runid } = useParams<{ runid: string }>();
  const { election } = useStore();
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [navigationSheetOpen, setNavigationSheetOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-votopurple-500 text-white p-2 grid grid-cols-[4rem_auto_4rem] items-center">
      <div className="justify-self-start">
        <button className="p-2 rounded-full hover:bg-votopurple-600 transition-colors">
          <ChevronLeft className="size-6" onClick={() => router.back()} />
        </button>
      </div>
      {election && runid /*TODO remove runid if real data is present*/ && (
        <div className="text-center">
          <h1>
            <FormattedDate date={election.date} locale="de" />
          </h1>
          <p className="text-sm -mt-[0.25rem]">
            {election.location} {election.name}
          </p>
        </div>
      )}
      {
        /*!election*/ !runid /*TODO remove runid if real data is present*/ && (
          <Image
            src="/logo-dark.svg"
            alt="Voto"
            className="justify-self-center h-6 my-2"
            width={55}
            height={24}
          />
        )
      }
      <div className="flex gap-1 justify-self-end">
        {runid && (
          <button className="p-2 rounded-full hover:bg-votopurple-600 transition-colors">
            <QrCode
              className="size-6"
              onClick={() => setShareDrawerOpen(true)}
            />
          </button>
        )}
        <button className="p-2 rounded-full hover:bg-votopurple-600 transition-colors">
          <Menu
            className="size-6"
            onClick={() => setNavigationSheetOpen(true)}
          />
        </button>
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
    month: "long",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(dateObj);

  // Create JSX elements with bold formatting for day and month and uppercase for month
  return (
    <span>
      {parts.map((part, index) => {
        return (
          <span
            key={index}
            className={`${part.type !== "year" ? "font-bold" : ""} ${part.type === "month" ? "uppercase" : ""}`}
          >
            {part.value}
          </span>
        );
      })}
    </span>
  );
}
