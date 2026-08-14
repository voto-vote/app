"use client";

import { Link } from "@/i18n/navigation";
import { ElectionSummary } from "@/types/election-summary";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Fragment, useState } from "react";

export default function Elections({
  electionSummaries,
}: {
  electionSummaries: ElectionSummary[];
}) {
  const locale = useLocale();
  const t = useTranslations("Elections");

  const groupedElectionSummaries = electionSummaries.reduce(
    (groups, election) => {
      const date = election.electionDate.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(election);
      return groups;
    },
    {} as Record<string, ElectionSummary[]>,
  );

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8 lg:p-16">
      <motion.div
        key="timelineheader"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="m-8 md:m-12 lg:m-16"
      >
        <Image
          src="/logo.svg"
          alt="logo"
          height={219}
          width={500}
          className="w-1/2 md:w-1/3 lg:w-1/4 mx-auto mb-4"
          priority
        />
        <h2 className="text-center text-lg md:text-xl lg:text-2xl font-bold">
          {t("tagline")}
        </h2>
      </motion.div>

      <div className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-4">
        {Object.entries(groupedElectionSummaries).map(
          ([date, summaries], index) => {
            const dateObj = new Date(date);
            const dayAndMonth = new Intl.DateTimeFormat(locale, {
              day: "2-digit",
              month: "2-digit",
            }).format(dateObj);
            const year = new Intl.DateTimeFormat(locale, {
              year: "numeric",
            }).format(dateObj);

            return (
              <Fragment key={index}>
                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.2 }}
                >
                  <div className="h-fit flex flex-col leading-none sticky top-0 bg-background z-10 py-2">
                    <div className="font-bold text-xl md:text-2xl leading-tight">
                      {dayAndMonth}
                    </div>
                    <div className="md:text-lg leading-tight">{year}</div>
                  </div>
                  <div className="grow flex flex-col items-center mt-2">
                    <div className="bg-foreground size-1.5 rounded-full"></div>
                    <div className="grow bg-foreground w-px"></div>
                    <div className="bg-foreground size-1.5 rounded-full"></div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.2 }}
                  className="grow flex flex-col gap-4 md:gap-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(summaries ?? []).map((summary, idx) => (
                      <ElectionCard key={idx} summary={summary} index={idx} />
                    ))}
                  </div>
                </motion.div>
              </Fragment>
            );
          },
        )}
      </div>
    </div>
  );
}

function ElectionCard({
  summary,
  index,
}: {
  summary: ElectionSummary;
  index: number;
}) {
  const t = useTranslations("Elections");
  const [imageSrc, setImageSrc] = useState(summary.image || "/placeholder.svg");

  return (
    <div className="transition-all duration-200 hover:scale-[1.02] flex flex-col">
      <div className="sticky top-0 bg-background z-10 py-2 grow">
        <div className="font-bold text-xl md:text-2xl leading-tight">
          {summary.title}
        </div>
        <div className="md:text-lg leading-tight">{summary.subtitle}</div>
      </div>
      <Link
        href={`/elections/${summary.id}`}
        className="block mt-2 rounded-lg overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt={summary.subtitle}
          height={300}
          width={500}
          className="w-full aspect-4/3 object-cover"
          priority={index < 2}
          onError={() => setImageSrc("/placeholder.svg")}
        />
        <div className="bg-primary text-primary-foreground text-center px-4 py-2 md:py-3 font-semibold w-full hover:brightness-110 transition-all">
          {t("openElectionsButton")}
        </div>
      </Link>
    </div>
  );
}
