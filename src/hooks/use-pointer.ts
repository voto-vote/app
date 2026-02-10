"use client";

import { useSyncExternalStore } from "react";

export type Pointer = "coarse" | "fine";

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia("(pointer: coarse)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot(): Pointer {
  return window.matchMedia("(pointer: coarse)").matches ? "coarse" : "fine";
}

function getServerSnapshot(): Pointer {
  return "fine";
}

export function usePointer(): Pointer {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
