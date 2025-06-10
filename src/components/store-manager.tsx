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
  const { election, setElection, clearElection } = useElectionStore();
  const { setTheses, clearTheses } = useThesesStore();
  const locale = useLocale();

  useEffect(() => {
    const handleRouteChange = async () => {
      const [, ...segments] = pathname.split("/");

      const isElectionRoute = segments[0] === "elections";
      const isThesesRoute = segments[2] === "theses";
      const isResultsRoute = segments[2] === "results";

      const promises = [];

      // If we are on an election route AND have an election ID path param set,
      // fetch the election and theses data
      if (isElectionRoute && electionid) {
        const fetchElectionPromise = fetchElection(electionid).then((e) =>
          setElection(e)
        );
        promises.push(fetchElectionPromise);
      } else {
        clearElection();
      }

      if ((isResultsRoute || isThesesRoute) && electionid) {
        const fetchThesesPromise = fetchTheses(electionid, locale).then((t) =>
          setTheses(t)
        );
        promises.push(fetchThesesPromise);
      } else {
        clearTheses();
      }

      await Promise.all(promises);
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
    election?.id,
  ]);

  return null; // This component doesn't render anything
}
