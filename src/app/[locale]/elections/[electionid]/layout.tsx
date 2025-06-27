import { getElection } from "@/actions/election-action";
import { ElectionProvider } from "@/contexts/election-context";
import ElectionChangeHandler from "./election-change-handler";

export default async function ElectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ electionid: string }>;
}) {
  const { electionid } = await params;
  const election = await getElection(electionid);

  return (
    <ElectionProvider election={election}>
      <ElectionChangeHandler election={election} />
      {children}
    </ElectionProvider>
  );
}
