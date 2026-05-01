import Placeholder from "@/components/misc-ui/Placeholder";
import F1TeamStandings from "@/components/motorsport/f1/F1TeamStandings";
import { f1Service } from "@/services/motorsport.service";

export default async function Page(props: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await props.params;
  const standings = await f1Service.f1ConstructorStandings(season);

  if (standings === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <F1TeamStandings data={standings.standings} />;
}
