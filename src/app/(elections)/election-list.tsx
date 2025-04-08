"use client";

import { Election } from "@/lib/api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ElectionList({ elections }: { elections: Election[] }) {
  const groupedElections = Object.groupBy(elections, ({ date }) => date);

  const dayAndMonthFormatter = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });

  const yearFormatter = new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
  });

  return (
    <div>
      <motion.div
        key="timelineheader"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="m-8"
      >
        <Image
          src="/logo.svg"
          alt="logo"
          height={219}
          width={500}
          className="w-1/2 mx-auto mb-4"
          priority
        />
        <h2 className="text-center text-lg font-bold">Wählen einfach machen</h2>
      </motion.div>

      {Object.entries(groupedElections).map(([date, elections], index) => {
        const dateObj = new Date(date);
        const dayAndMonth = dayAndMonthFormatter.format(dateObj);
        const year = yearFormatter.format(dateObj);
        return (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 + index * 0.2 }}
            className="m-4 relative"
          >
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <div className="h-fit flex flex-col leading-none sticky top-0 bg-white">
                  <div className="font-extrabold text-xl">{dayAndMonth}</div>
                  <div className="">{year}</div>
                </div>
                <div className="grow flex flex-col items-center mt-2">
                  <div className="bg-black size-[0.375rem] rounded-full"></div>
                  <div className="grow bg-black w-0.5"></div>
                  <div className="bg-black size-[0.375rem] rounded-full"></div>
                </div>
              </div>
              <div className="grow flex flex-col gap-4">
                {(elections ?? []).map((election, index) => (
                  <div key={index}>
                    <div className="sticky top-0 bg-white">
                      <div className="font-bold text-xl">{election.title}</div>
                      <div className="-mt-1">{election.subtitle}</div>
                    </div>
                    <Link href={`/elections/${election.id}`}>
                      <Image
                        src={election.image}
                        alt={election.subtitle}
                        height={200}
                        width={200}
                        className="rounded-t-lg w-full mt-2"
                        priority={index < 2}
                      />
                      <div className="bg-primary text-white text-center px-4 py-2 rounded-b-lg font-semibold w-full">
                        VOTO öffnen
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
