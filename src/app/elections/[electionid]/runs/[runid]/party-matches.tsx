"use client";

import { motion } from "framer-motion";

interface Party {
  id: string;
  name: string;
  matchPercentage: number;
  color: string;
}

interface PartyMatchesProps {
  parties: Party[];
  liveMatchesVisible: boolean;
}

export default function PartyMatches({
  parties,
  liveMatchesVisible,
}: PartyMatchesProps) {
  const sortedParties = [...parties].sort(
    (a, b) => b.matchPercentage - a.matchPercentage
  );
  const topParties = sortedParties.slice(0, 4);

  return (
    <div
      className={`grid grid-cols-4 gap-2 transition-all duration-300 ease-in-out overflow-hidden ${liveMatchesVisible ? "p-4 pt-2 border-b opacity-100 max-h-24" : "opacity-0 max-h-0 p-0 border-b-0"}`}
    >
      {topParties.map((party) => (
        <motion.div key={party.id} className="space-y-1" layout>
          <p className="text-sm font-medium truncate">{party.name}</p>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${party.matchPercentage}%`,
                backgroundColor: party.color,
              }}
            ></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
