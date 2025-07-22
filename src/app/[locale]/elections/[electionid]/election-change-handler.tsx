"use client";

import { useHeader } from "@/contexts/header-context";
import { Election } from "@/types/election";
import { useEffect } from "react";

export default function ElectionChangeHandler({
  election,
}: {
  election: Election;
}) {
  const { setHeaderDetails } = useHeader();

  useEffect(() => {
    setHeaderDetails({
      electionId: election.id,
      electionDate: election.electionDate,
      title: election.title,
      subtitle: election.subtitle,
      logo: election.theming.logo,
    });
    setTheming(election.theming.primary);

    return () => {
      setHeaderDetails(null);
      setTheming(null);
    };
  }, [election, setHeaderDetails]);

  return null; // This component doesn't render anything
}

function setTheming(primaryColor: string | null) {
  const styles = getComputedStyle(document.documentElement);
  const defaultBrandColor = styles.getPropertyValue("--color-brand-voto");
  const newBrandColor = primaryColor || defaultBrandColor;

  document.documentElement.style.setProperty("--color-brand", newBrandColor);
}
