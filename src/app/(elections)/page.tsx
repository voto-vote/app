import { getElections } from "@/lib/api";
import ElectionList from "./election-list";

export default async function Home() {
  const elections = await getElections();

  return <ElectionList elections={elections} />;
}
