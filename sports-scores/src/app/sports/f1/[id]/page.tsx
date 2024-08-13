import { fetchF1SessionResult } from "@/api/f1.api";
import F1SessionStandings from "@/components/f1/F1SessionStandings";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: number } }) {
  const rawRaceResults = await fetchF1SessionResult(params.id);

  if (rawRaceResults === null) {
    redirect("/misc/apiError");
  }

  return <F1SessionStandings data={rawRaceResults} />;
}
