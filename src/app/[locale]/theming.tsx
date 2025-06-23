"use client";

import { useElectionStore } from "@/stores/election-store";
import { useEffect } from "react";

export default function Theming() {
  const { election } = useElectionStore();

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const defaultBrandColor = styles.getPropertyValue("--color-brand-voto");

    let newBrandColor = defaultBrandColor;
    if (election?.theming?.primary) {
      newBrandColor = election.theming.primary || defaultBrandColor;
    }
    document.documentElement.style.setProperty("--color-brand", newBrandColor);
  }, [election]);

  return null;
}
