"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useElectionStore } from "@/stores/election-store";
import { fetchElection } from "@/lib/election";

export default function ElectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { electionid } = useParams<{ electionid: string }>();
  const { setElection } = useElectionStore();

  useEffect(() => {
    (async () => {
      const election = await fetchElection(electionid);
      setElection(election);
    })();
  }, [electionid, setElection]);
  return children;
}
