import Placeholder from "@/components/misc-ui/Placeholder";
import F1DriverStandings from "@/components/motorsport/f1/F1DriverStandings";
import { f1DriverStandings } from "@/services/motorsport.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await props.params;
  const standings = await f1DriverStandings(Number(season));

  if (standings === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <F1DriverStandings data={standings.standings} />;
}
