"use client";

import { useParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useElectionStore } from "@/stores/election-store";
import { getElection } from "@/actions/election-action";

export default function ElectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { electionid } = useParams<{ electionid: string }>();
  const { setElection, clearElection } = useElectionStore();

  useEffect(() => {
    getElection(electionid).then((election) => {
      setElection(election);
    });

    return () => {
      clearElection();
    };
  }, [clearElection, electionid, setElection]);

  return <Suspense fallback={<div>Loading election data...</div>}>
    {children}
  </Suspense>;
}
