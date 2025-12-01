"use client";

import { useParams } from "next/navigation";
import CandidateOrParty from "../../candidate-or-party";
import { useResultStore } from "@/stores/result-store";

export default function CandidatePage() {
  const { candidateid } = useParams<{ candidateid: string }>();
  const { results } = useResultStore();

  if (!results) {
    return null;
  }

  const result = results.find((r) => String(r.entity.id) === candidateid);
  if (!result) {
    return null;
  }

  return (
    <CandidateOrParty result={result} disableBookmarks={results.length <= 2} />
  );
}
