"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useElectionStore } from "@/stores/election-store";
import { useThesesStore } from "@/stores/theses-store";
import { useParams } from "next/navigation";
import { fetchElection } from "@/lib/election";
import { fetchTheses } from "@/lib/theses";
import { useLocale } from "next-intl";

export function NavigationEvents() {
  const pathname = usePathname();
  const { electionid } = useParams<{ electionid: string }>();
  const locale = useLocale();
  const { election, setElection, clearElection } = useElectionStore();
  const {
    theses,
    electionId: thesesElectionId,
    setTheses,
    clearTheses,
  } = useThesesStore();

  useEffect(() => {
    // Fetch election data when navigating to an election page
    // Remove previous election data if not on an election page
    if (pathname.startsWith(`/elections/${electionid}`)) {
      if (!election || election.id !== electionid) {
        fetchElection(electionid).then((e) => setElection(e));
      }
    } else if (election) {
      clearElection();
    }

    // Fetch theses data when navigating to a theses page
    // Remove previous theses data if not on a theses page
    if (
      pathname.startsWith(`/elections/${electionid}/theses`) ||
      pathname.startsWith(`/elections/${electionid}/result`)
    ) {
      if (!theses || thesesElectionId !== electionid) {
        fetchTheses(electionid, locale).then((t) => setTheses(t, electionid));
      }
    } else if (theses) {
      clearTheses();
    }
  }, [
    clearElection,
    clearTheses,
    election,
    electionid,
    locale,
    pathname,
    setElection,
    setTheses,
    theses,
    thesesElectionId,
  ]);

  return null;
}
