import F1TeamStandings from "@/components/f1/F1TeamStandings";
import Placeholder from "@/components/misc/Placeholder";
import { f1ConstructorStandings } from "@/services/f1.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const standings = await f1ConstructorStandings(2025);

  if (standings === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <F1TeamStandings data={standings.standings} />;
}
