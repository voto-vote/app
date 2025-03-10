"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const elections = Object.groupBy(
    [
      {
        day: "19",
        month: "JAN",
        year: "2025",
        region: "Burgenland",
        type: "Landtagswahl",
        image: "/regions/burgenland.jpg",
      },
      {
        day: "24",
        month: "NOV",
        year: "2024",
        region: "Steiermark",
        type: "Landtagswahl",
        image: "/regions/steiermark.jpg",
      },
      {
        day: "13",
        month: "OCT",
        year: "2024",
        region: "Vorarlberg",
        type: "Landtagswahl",
        image: "/regions/vorarlberg.jpg",
      },
      {
        day: "13",
        month: "OCT",
        year: "2024",
        region: "Vorarlberg 2",
        type: "Landtagswahl",
        image: "/regions/vorarlberg.jpg",
      },
      {
        day: "13",
        month: "OCT",
        year: "2024",
        region: "Vorarlberg 3",
        type: "Landtagswahl",
        image: "/regions/vorarlberg.jpg",
      },
      {
        day: "13",
        month: "OCT",
        year: "2024",
        region: "Vorarlberg 4",
        type: "Landtagswahl",
        image: "/regions/vorarlberg.jpg",
      },
    ],
    ({ day, month, year }) => day + "," + month + "," + year
  );

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
        />
        <h2 className="text-center text-lg font-bold">Wählen einfach machen</h2>
      </motion.div>
      {Object.entries(elections).map(([date, elections], index) => (
        <motion.div
          key={index}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 + index * 0.2 }}
          className="m-4 relative"
        >
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-fit flex flex-col text-center leading-none sticky top-0 bg-white">
                <div className="font-bold text-2xl">{date.split(",")[0]}</div>
                <div className="font-bold -mt-1">{date.split(",")[1]}</div>
                <div className="text-sm">{date.split(",")[2]}</div>
              </div>
              <div className="grow flex flex-col items-center">
                <div className="bg-black size-[0.375rem] rounded-full"></div>
                <div className="grow bg-black w-0.5"></div>
                <div className="bg-black size-[0.375rem] rounded-full"></div>
              </div>
            </div>
            <div className="grow flex flex-col gap-4">
              {(elections ?? []).map((election, index) => (
                <div key={index}>
                  <div className="sticky top-0 bg-white">
                    <div className="text-xl">{election.type}</div>
                    <div className="text-xl font-bold -mt-1.5">
                      {election.region}
                    </div>
                  </div>
                  <Image
                    src={election.image}
                    alt={election.region}
                    height={200}
                    width={200}
                    className="rounded-t-lg w-full mt-2"
                  />
                  <button className="bg-votopurple-500 text-white px-4 py-2 rounded-b-lg font-semibold w-full">
                    VOTO öffnen
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
