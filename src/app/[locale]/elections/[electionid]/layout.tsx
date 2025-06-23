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
  const { setElection, clearElection } = useElectionStore();

  useEffect(() => {
    fetchElection(electionid).then((election) => {
      setElection(election);
    });

    return () => {
      clearElection();
    };
  }, [clearElection, electionid, setElection]);

  return children;
}
