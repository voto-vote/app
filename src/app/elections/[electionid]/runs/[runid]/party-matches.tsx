"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Party {
  id: string;
  name: string;
  matchPercentage: number;
  color: string;
}

interface PartyMatchesProps {
  parties: Party[];
}

export default function PartyMatches({ parties }: PartyMatchesProps) {
  const sortedParties = [...parties].sort(
    (a, b) => b.matchPercentage - a.matchPercentage
  );
  const topParties = sortedParties.slice(0, 4);

  return (
    <Card className="gap-3 p-3 bg-white/50 backdrop-blur-sm dark:bg-gray-950/50">
      <div className="flex items-center gap-2">
        <Badge className="bg-votopurple-500 hover:bg-votopurple-700 h-5 text-xs px-1.5">
          LIVE
        </Badge>
        <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300">
          Parteiübereinstimmung
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {topParties.map((party) => (
          <motion.div key={party.id} layout>
            <PartyMatchBadge party={party} />
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function PartyMatchBadge({ party }: { party: Party }) {
  return (
    <div className="rounded-full h-6 w-full relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{ backgroundColor: party.color }}
      ></div>
      <motion.div
        className="rounded-full h-6"
        style={{
          backgroundColor: party.color,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${party.matchPercentage}%` }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      <span className="absolute inset-0 text-center py-1 px-2 text-xs font-medium text-white truncate">
        {party.name}
      </span>
    </div>
  );
}
