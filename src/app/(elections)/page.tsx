import { fetchElectionSummaries } from "@/actions/election-actions";
import ElectionList from "@/app/(elections)/election-list";

export default async function ElectionListPage() {
  const electionSummaries = await fetchElectionSummaries();

  return <ElectionList electionSummaries={electionSummaries} />;
}
