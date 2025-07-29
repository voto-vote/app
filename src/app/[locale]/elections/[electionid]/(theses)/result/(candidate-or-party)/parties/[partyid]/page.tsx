"use client";

import { useParams } from "next/navigation";
import CandidateOrParty from "../../candidate-or-party";
import { useResultStore } from "@/stores/result-store";

export default function PartyPage() {
  const { partyid } = useParams<{ partyid: string }>();
  const { results } = useResultStore();

  if (!results) {
    return null;
  }

  const result = results.find((r) => String(r.entity.id) === partyid);
  if (!result) {
    return null;
  }

  return <CandidateOrParty result={result} />;
}
