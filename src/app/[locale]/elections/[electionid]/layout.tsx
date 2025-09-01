import { getElection } from "@/actions/election-action";
import { ElectionProvider } from "@/contexts/election-context";
import ElectionChangeHandler from "./election-change-handler";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]/elections/[electionid]">): Promise<Metadata> {
  const { electionid } = await params;
  const election = await getElection(electionid);
  if (!election) {
    notFound();
  }

  let description = election.description;
  if (description.length > 150) {
    description = description.slice(0, 150) + "...";
  }

  return {
    title: election.title + " " + election.subtitle + " | VOTO",
    description,
  };
}

export default async function ElectionLayout({
  children,
  params,
}: LayoutProps<"/[locale]/elections/[electionid]">) {
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
