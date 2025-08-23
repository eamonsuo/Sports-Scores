import AmericanFootballLadder from "@/components/american-football/AmericanFootballLadder";
import Placeholder from "@/components/misc/Placeholder";
import { americanFootballStandings } from "@/services/american-football.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await americanFootballStandings(
    Number(league),
    Number(season),
  );

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {pageData.tables.map((item) => (
        <AmericanFootballLadder key={item.tableName} data={item} />
      ))}
    </div>
  );
  return;
}
