import { fetchElectionSummaries } from "@/actions/election-actions";
import Elections from "@/app/[locale]/(root)/elections";

export default async function ElectionListPage() {
  const electionSummaries = await fetchElectionSummaries();

  return <Elections electionSummaries={electionSummaries} />;
}
