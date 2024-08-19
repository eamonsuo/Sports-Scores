import { fetchF1SessionResult } from "@/api/f1.api";
import F1SessionStandings from "@/components/f1/F1SessionStandings";
import Placeholder from "@/components/misc/Placeholder";

export default async function Page({ params }: { params: { id: number } }) {
  const rawRaceResults = await fetchF1SessionResult(params.id);

  if (typeof rawRaceResults === "string") {
    return <Placeholder>{rawRaceResults}</Placeholder>;
  }

  return <F1SessionStandings data={rawRaceResults} />;
}
