import { fetchNFLStandings } from "@/api/nfl.api";
import Placeholder from "@/components/misc/Placeholder";
import NFLLadder from "@/components/nfl/NFLLadder";

export default async function Page() {
  const standings = await fetchNFLStandings(2024);

  if (typeof standings === "string") {
    return <Placeholder>{standings}</Placeholder>;
  }

  return <NFLLadder data={standings} />;
}
