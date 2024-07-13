import { fetchNFLStandings } from "@/api/nfl.api";
import NFLLadder from "@/components/nfl/NFLLadder";

export default async function Page() {
  const standings = await fetchNFLStandings(2024);
  return <NFLLadder data={standings} />;
}
