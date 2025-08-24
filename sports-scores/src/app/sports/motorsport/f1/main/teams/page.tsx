import Placeholder from "@/components/misc/Placeholder";
import F1TeamStandings from "@/components/motorsport/f1/F1TeamStandings";
import { f1ConstructorStandings } from "@/services/motorsport.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const standings = await f1ConstructorStandings(2025);

  if (standings === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <F1TeamStandings data={standings.standings} />;
}
