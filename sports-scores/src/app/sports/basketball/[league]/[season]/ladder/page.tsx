import BasketballLadder from "@/components/basketball/BasketballLadder";
import Placeholder from "@/components/misc-ui/Placeholder";
import { basketballStandings } from "@/services/basketball.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await basketballStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {/* {league === "9464" && (
          <PlayoffPicture {...getNFLPlayoffPicture(pageData.tables)} />
        )} */}
      {pageData.standings.map((item) => (
        <BasketballLadder
          key={item.tableName}
          data={item}
          qualifyingPosition={pageData.qualifyingPosition}
        />
      ))}
    </div>
  );
}
