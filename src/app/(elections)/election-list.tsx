"use client";

import type { ElectionSummary } from "@/lib/api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ElectionList({
  electionSummaries,
}: {
  electionSummaries: ElectionSummary[];
}) {
  const groupedElectionSummaries = Object.groupBy(
    electionSummaries,
    ({ date }) => date
  );

  const dayAndMonthFormatter = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });

  const yearFormatter = new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
  });

  return (
    <div className="container mx-auto max-w-screen-xl">
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
          Wählen einfach machen
        </h2>
      </motion.div>

      <div className="md:px-8 lg:px-16">
        {Object.entries(groupedElectionSummaries).map(
          ([date, summaries], index) => {
            const dateObj = new Date(date);
            const dayAndMonth = dayAndMonthFormatter.format(dateObj);
            const year = yearFormatter.format(dateObj);
            return (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2 + index * 0.2 }}
                className="m-4 md:m-6 relative"
              >
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="h-fit flex flex-col leading-none sticky top-0 bg-background z-10 py-2">
                      <div className="font-extrabold text-xl md:text-2xl">
                        {dayAndMonth}
                      </div>
                      <div className="md:text-lg">{year}</div>
                    </div>
                    <div className="grow flex flex-col items-center mt-2">
                      <div className="bg-foreground size-[0.375rem] rounded-full"></div>
                      <div className="grow bg-foreground w-0.5"></div>
                      <div className="bg-foreground size-[0.375rem] rounded-full"></div>
                    </div>
                  </div>
                  <div className="grow flex flex-col gap-4 md:gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(summaries ?? []).map((summary, idx) => (
                        <ElectionCard key={idx} summary={summary} index={idx} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }
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
  return (
    <div className="transition-all duration-200 hover:scale-[1.02]">
      <div className="sticky top-0 bg-background z-10 py-2">
        <div className="font-bold text-xl md:text-2xl">{summary.title}</div>
        <div className="-mt-1 md:text-lg">{summary.subtitle}</div>
      </div>
      <Link
        href={`/elections/${summary.id}`}
        className="block mt-2 rounded-lg overflow-hidden"
      >
        <Image
          src={summary.image || "/placeholder.svg"}
          alt={summary.subtitle}
          height={300}
          width={500}
          className="w-full aspect-[4/3] object-cover"
          priority={index < 2}
        />
        <div className="bg-primary text-primary-foreground text-center px-4 py-2 md:py-3 font-semibold w-full hover:brightness-110 transition-all">
          VOTO öffnen
        </div>
      </Link>
    </div>
  );
}
