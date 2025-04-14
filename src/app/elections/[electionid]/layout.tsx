import { ElectionProvider } from "@/contexts/ElectionContext";
import { getElection } from "@/lib/api";

export default async function ElectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ electionid: string }>;
}) {
  const { electionid } = await params;
  const election = await getElection(electionid);

  return <ElectionProvider election={election}>{children}</ElectionProvider>;
}
