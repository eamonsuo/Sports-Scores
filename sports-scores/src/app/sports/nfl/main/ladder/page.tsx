import { fetchNFLStandings } from "@/api/nfl.api";
import NFLLadder from "@/components/nfl/NFLLadder";
import { redirect } from "next/navigation";

export default async function Page() {
  const standings = await fetchNFLStandings(2024);

  if (standings === null) {
    redirect("/misc/apiError");
  }

  return <NFLLadder data={standings} />;
}
