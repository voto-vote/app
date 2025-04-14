"use client";

import { Election } from "@/lib/api";
import { createContext, useState, useContext } from "react";

interface ElectionContextType {
  election: Election;
  setElection: (election: Election) => void;
}

const ElectionContext = createContext<ElectionContextType | undefined>(
  undefined
);

export function ElectionProvider({
  children,
  election,
}: {
  children: React.ReactNode;
  election: Election;
}) {
  const [el, setElection] = useState<Election>(election);

  return (
    <ElectionContext.Provider value={{ election: el, setElection }}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error("useElection must be used within a ElectionProvider");
  }
  return context;
}
