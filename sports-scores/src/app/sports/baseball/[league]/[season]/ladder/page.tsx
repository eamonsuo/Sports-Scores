import BaseballLadder from "@/components/baseball/BaseballLadder";
import Placeholder from "@/components/misc/Placeholder";
import { baseballStandings } from "@/services/baseball.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await baseballStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {/* {league === "9464" && (
          <PlayoffPicture {...getNFLPlayoffPicture(pageData.tables)} />
        )} */}
      {pageData.tables.map((item) => (
        <BaseballLadder key={item.tableName} data={item} />
      ))}
    </div>
  );
}
