import { getElection } from "@/actions/election-action";
import { ElectionProvider } from "@/contexts/election-context";
import ElectionChangeHandler from "./election-change-handler";
import { notFound } from "next/navigation";

export default async function ElectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ electionid: string }>;
}) {
  const { electionid } = await params;
  const election = await getElection(electionid);
  if (!election) {
    notFound();
  }

  return (
    <ElectionProvider election={election}>
      <ElectionChangeHandler election={election} />
      {children}
    </ElectionProvider>
  );
}
