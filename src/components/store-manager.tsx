"use client";

import { useEffect } from "react";
import { useElectionStore } from "@/stores/election-store";
import { useThesesStore } from "@/stores/theses-store";
import { fetchElection, fetchTheses } from "@/actions/election-actions";
import { usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

export function ElectionStoreManager() {
  const { electionid } = useParams<{ electionid?: string }>();
  const pathname = usePathname();
  const { setElection, clearElection } = useElectionStore();
  const { setTheses, clearTheses } = useThesesStore();
  const locale = useLocale();

  useEffect(() => {
    const handleRouteChange = async () => {
      const isElectionsRoute = pathname.startsWith("/elections/");

      if (isElectionsRoute && electionid) {
        const election = await fetchElection(electionid);
        const theses = await fetchTheses(electionid, locale);
        setElection(election);
        setTheses(theses);
      } else {
        clearElection();
        clearTheses();
      }
    };

    handleRouteChange();
  }, [
    pathname,
    setElection,
    clearElection,
    electionid,
    setTheses,
    clearTheses,
    locale,
  ]);

  return null; // This component doesn't render anything
}
