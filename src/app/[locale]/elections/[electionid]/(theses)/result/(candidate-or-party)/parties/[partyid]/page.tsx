"use client";

import { useParams, notFound } from "next/navigation";
import CandidateOrParty from "../../candidate-or-party";
import { usePartiesStore } from "@/stores/party-store";

export default function PartyPage() {
  const { partyid } = useParams<{ partyid: string }>();
  const { parties } = usePartiesStore();

  if (!parties) {
    return null;
  }

  const party = parties.find((p) => String(p.id) === partyid);
  if (!party) {
    notFound();
  }

  return <CandidateOrParty entity={party} />;
}
