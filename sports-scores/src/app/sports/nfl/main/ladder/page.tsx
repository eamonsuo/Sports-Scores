import Placeholder from "@/components/misc/Placeholder";
import NFLLadder from "@/components/nfl/NFLLadder";
import { fetchNFLStandings } from "@/endpoints/nfl.api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const standings = await fetchNFLStandings(2024);

  if (typeof standings === "string") {
    return <Placeholder>{standings}</Placeholder>;
  }

  return <NFLLadder data={standings} />;
}
