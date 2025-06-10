"use client";

import { useBackButtonStore } from "@/stores/back-button-store";
import { useElectionStore } from "@/stores/election-store";
import { useEffect } from "react";

export default function ResultsPage() {
  const { election } = useElectionStore();
  const { setBackPath } = useBackButtonStore();

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}/theses`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  if (!election) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold">Results Page</h1>
      <p className="mt-4 text-lg">This is the results page for the election.</p>
    </div>
  );
}
