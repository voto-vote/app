"use client";

import { useState, useEffect } from "react";

export type Pointer = "coarse" | "fine";

export function usePointer(): Pointer {
  const [isCoarse, setIsCoarse] = useState<Pointer>("fine");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsCoarse(e.matches ? "coarse" : "fine");
    };

    setIsCoarse(mediaQuery.matches ? "coarse" : "fine");
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isCoarse;
}
