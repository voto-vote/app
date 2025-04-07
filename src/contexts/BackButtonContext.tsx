"use client";

import { createContext, useState, useContext } from "react";

interface BackButtonContextType {
  backPath: string;
  setBackPath: (path: string) => void;
}

const BackButtonContext = createContext<BackButtonContextType>({
  backPath: "/",
  setBackPath: () => {},
});

export function BackButtonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [backPath, setBackPath] = useState("/");

  return (
    <BackButtonContext.Provider value={{ backPath, setBackPath }}>
      {children}
    </BackButtonContext.Provider>
  );
}

export function useBackButton() {
  const context = useContext(BackButtonContext);
  if (context === undefined) {
    throw new Error("useBackButton must be used within a BackButtonProvider");
  }
  return context;
}
