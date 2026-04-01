import Ladder from "@/components/all-sports/Ladder";
import Placeholder from "@/components/misc-ui/Placeholder";
import { rugbyLeagueStandings } from "@/services/rugby-league.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await rugbyLeagueStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {pageData.standings.map((table, index) => (
        <Ladder
          key={index}
          data={table.data}
          headings={table.headings}
          placingCategories={table.placingCategories}
        />
      ))}
    </div>
  );
}
