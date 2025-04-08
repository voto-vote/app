import { getElectionSummaries } from "@/lib/api";
import ElectionList from "@/app/(elections)/election-list";

export default async function Home() {
  const electionSummaries = await getElectionSummaries();

  return <ElectionList electionSummaries={electionSummaries} />;
}
