import Match from "@/components/bracket/components/match";
import FlexibleSingleEliminationBracket from "@/components/bracket/FlexibleSingleEliminationBracket";
import Placeholder from "@/components/misc-ui/Placeholder";
import { SPORT_ROUTE_CONFIG } from "@/lib/routeConfig";
import { SPORT } from "@/types/misc";

export default async function Page(props: {
  params: Promise<{ league: string; season: string; sport: string }>;
}) {
  const { league, season, sport } = await props.params;
  const config = SPORT_ROUTE_CONFIG[sport as SPORT];

  const pageData = await config.service.brackets(league, season);

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex flex-col overflow-x-auto overflow-y-auto">
      {pageData.brackets.map((bracket) => (
        <div key={bracket.id}>
          <div>{bracket.name}</div>
          <FlexibleSingleEliminationBracket
            key={bracket.id}
            matches={bracket.matches}
            matchComponent={Match}
          />
        </div>
      ))}
    </div>
  );
}
