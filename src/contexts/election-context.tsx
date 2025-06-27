"use client";

import { Election } from "@/types/election";
import { createContext, useContext, type ReactNode } from "react";

interface ElectionContextType {
  election: Election;
}

const ElectionContext = createContext<ElectionContextType | undefined>(
  undefined
);

interface ElectionProviderProps {
  children: ReactNode;
  election: Election;
}

export function ElectionProvider({
  children,
  election,
}: ElectionProviderProps) {
  return (
    <ElectionContext.Provider value={{ election }}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error("useElection must be used within an ElectionProvider");
  }
  return context;
}
