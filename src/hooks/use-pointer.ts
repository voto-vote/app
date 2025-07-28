"use client";

import { useState, useEffect } from "react";

export function usePointer(): boolean {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsCoarse(e.matches);
    };

    setIsCoarse(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isCoarse;
}
