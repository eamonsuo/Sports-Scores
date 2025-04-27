import F1DriverStandings from "@/components/f1/F1DriverStandings";
import Placeholder from "@/components/misc/Placeholder";
import { f1DriverStandings } from "@/services/f1.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const standings = await f1DriverStandings(2025);

  if (standings === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }
  return <F1DriverStandings data={standings.standings} />;
}
