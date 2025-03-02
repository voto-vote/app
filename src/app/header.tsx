"use client";

import { useStore } from "@/store";
import { ChevronLeft, Menu, QrCode } from "lucide-react";
import ShareDrawer, {
  useShareDrawerStore,
} from "./elections/[electionid]/runs/[runid]/share-drawer";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Header() {
  const { runid } = useParams<{ runid: string }>();
  const { election } = useStore();
  const { toggleOpen } = useShareDrawerStore();

  return (
    <header className="bg-votopurple-500 text-white px-4 py-2 grid grid-cols-[4rem_auto_4rem] items-center">
      <ChevronLeft className="size-6" />
      {election && (
        <div className="text-center">
          <h1>
            <FormattedDate date={election.date} locale="de" />
          </h1>
          <p className="text-sm -mt-[0.125rem]">
            {election.location} {election.name}
          </p>
        </div>
      )}
      {!election && (
        <Image
          src="/logo-dark.svg"
          alt="Voto"
          className="justify-self-center h-6"
          width={55}
          height={24}
        />
      )}
      <div className="flex gap-4 justify-self-end">
        {runid && <QrCode className="size-6" onClick={toggleOpen} />}
        <Menu className="size-6" />
      </div>
      <ShareDrawer />
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
