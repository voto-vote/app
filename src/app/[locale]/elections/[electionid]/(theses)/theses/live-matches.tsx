"use client";

import { Result } from "@/types/result";
import { motion } from "framer-motion";


interface LiveMatchesProps {
  entities: Result[];
  liveMatchesVisible: boolean;
}

export default function LiveMatches({
  entities,
  liveMatchesVisible,
}: LiveMatchesProps) {
  const sortedMatches = [...entities].sort(
    (a, b) => b.matchPercentage - a.matchPercentage
  );
  const topEntities = sortedMatches.slice(0, 4);

  return (
    <div
      className={`grid grid-cols-4 gap-2 transition-all duration-300 ease-in-out overflow-hidden md:max-w-3xl md:mx-auto ${
        liveMatchesVisible
          ? "p-4 pt-2 border-b opacity-100 max-h-24"
          : "opacity-0 max-h-0 p-0 border-b-0"
      }`}
    >
      {topEntities.map((match) => (
        <motion.div key={match.entity_id} className="space-y-1" layout>
          <p className="text-sm font-medium truncate">{match.displayName}</p>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${match.matchPercentage}%`,
                backgroundColor: match.color || "var(--primary)"
              }}
            ></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
