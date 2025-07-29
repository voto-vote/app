"use client";

import { notFound, useParams } from "next/navigation";
import CandidateOrParty from "../../candidate-or-party";
import { useCandidatesStore } from "@/stores/candidate-store";

export default function CandidatePage() {
  const { candidateid } = useParams<{ candidateid: string }>();
  const { candidates } = useCandidatesStore();

  if (!candidates) {
    return null;
  }

  const candidate = candidates.find((c) => String(c.id) === candidateid);
  if (!candidate) {
    notFound();
  }

  return <CandidateOrParty entity={{ ...candidate, type: "candidate" }} />;
}
