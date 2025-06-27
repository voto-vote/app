"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type HeaderDetails = {
  electionId: number;
  electionDate: string;
  title: string;
  subtitle: string;
  logo?: string;
};

interface HeaderContextType {
  headerDetails: HeaderDetails | null;
  setHeaderDetails: (details: HeaderDetails | null) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

interface HeaderProviderProps {
  children: ReactNode;
}

export function HeaderProvider({ children }: HeaderProviderProps) {
  const [headerDetails, setHeaderDetails] = useState<HeaderDetails | null>(
    null
  );

  return (
    <HeaderContext.Provider value={{ headerDetails, setHeaderDetails }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within an HeaderProvider");
  }
  return context;
}
