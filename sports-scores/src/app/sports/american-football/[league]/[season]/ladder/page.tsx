import Ladder, { SportsLadder } from "@/components/all-sports/Ladder";
import PlayoffPicture from "@/components/all-sports/PlayoffPicture";
import Placeholder from "@/components/misc-ui/Placeholder";
import { AMERICAN_FOOTBALL_LADDER_HEADINGS } from "@/lib/constants";
import { americanFootballService } from "@/services/american-football.service";

type AFTable = SportsLadder<typeof AMERICAN_FOOTBALL_LADDER_HEADINGS>;
type AFTeam = AFTable["data"][number];

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await americanFootballService.standings(
    Number(league),
    Number(season),
  );

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {pageData.playoffPicture && (
        <PlayoffPicture data={pageData.playoffPicture} />
      )}
      {pageData.standings.map((table, index) => (
        <Ladder
          key={index}
          data={table.data}
          headings={table.headings}
          placingCategories={table.placingCategories}
          tableName={table.tableName}
        />
      ))}
    </div>
  );
}
