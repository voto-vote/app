"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { useElectionStore } from "@/stores/election-store";
import { fetchElection } from "@/actions/election-actions";

export function ElectionStoreManager() {
  const { electionid } = useParams<{ electionid?: string }>();
  const pathname = usePathname();
  const { setElection, clearElection } = useElectionStore();

  useEffect(() => {
    const handleRouteChange = async () => {
      const isElectionsRoute = pathname.startsWith("/elections/");

      if (isElectionsRoute && electionid) {
        const election = await fetchElection(electionid);
        setElection(election);
      } else {
        clearElection();
      }
    };

    handleRouteChange();
  }, [pathname, setElection, clearElection, electionid]);

  return null; // This component doesn't render anything
}
