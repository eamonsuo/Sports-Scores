import F1SessionStandings from "@/components/f1/F1SessionStandings";
import Placeholder from "@/components/misc/Placeholder";
import { f1SessionResults } from "@/services/f1.service";

export default async function Page(props: {
  params: Promise<{ round: number }>;
}) {
  const params = await props.params;
  const rawRaceResults = await f1SessionResults(params.round);

  if (typeof rawRaceResults === "string") {
    return <Placeholder>{rawRaceResults}</Placeholder>;
  }

  return <F1SessionStandings data={[]} />;
}
