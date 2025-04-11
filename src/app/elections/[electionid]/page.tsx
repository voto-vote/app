import { getElection } from "@/lib/api";
import Election from "@/app/elections/[electionid]/election";

export default async function ElectionPage({
  params,
}: {
  params: Promise<{ electionid: string }>;
}) {
  const { electionid } = await params;
  const election = await getElection(electionid);

  return <Election election={election} />;
}
