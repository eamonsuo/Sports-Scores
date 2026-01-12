import Match from "@/components/bracket/components/match";
import FlexibleSingleEliminationBracket from "@/components/bracket/FlexibleSingleEliminationBracket";
import Placeholder from "@/components/misc/Placeholder";
import { tennisBrackets } from "@/services/tennis.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await tennisBrackets(Number(league), Number(season));
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
