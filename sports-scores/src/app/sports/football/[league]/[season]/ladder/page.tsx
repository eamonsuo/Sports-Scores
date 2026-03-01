import FootballLadder from "@/components/football/FootballLadder";
import Placeholder from "@/components/misc-ui/Placeholder";
import { footballStandings } from "@/services/football.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await footballStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {pageData.tables.map((item) => (
        <FootballLadder
          key={item.tableName}
          data={item}
          qualifyingPosition={item.qualifyingPosition}
        />
      ))}
    </div>
  );
}
