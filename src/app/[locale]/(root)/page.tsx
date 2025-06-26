import Elections from "@/app/[locale]/(root)/elections";
import { getElectionSummaries } from "@/actions/election-summaries-actions";

export default async function ElectionListPage() {
  const electionSummaries = await getElectionSummaries();

  return <Elections electionSummaries={electionSummaries} />;
}
