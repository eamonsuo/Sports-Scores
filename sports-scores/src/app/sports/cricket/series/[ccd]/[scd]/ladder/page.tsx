import { fetchCricketSeriesMatches } from "@/api/cricket.api";
import CricketSeriesLadder, {
  CricketLadder,
} from "@/components/cricket/CricketSeriesLadder";
import Placeholder from "@/components/misc/Placeholder";
import { mapCricketSeriesLadders } from "@/lib/dataMapping";

export default async function Page(props: {
  params: Promise<{ ccd: string; scd: string }>;
}) {
  const params = await props.params;

  let rawSeries = await fetchCricketSeriesMatches(params.ccd, params.scd);
  let seriesLadders: CricketLadder[] | null = null;
  if (rawSeries?.Stages[0].LeagueTable != undefined) {
    seriesLadders = mapCricketSeriesLadders(rawSeries?.Stages[0].LeagueTable);
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {/* {seriesResults !== null &&
        !series.isTrophy &&
        seriesResults.results.map((item) => (
          <CricketSeriesResult
            key={item.series.id}
            seriesName={item.series.name}
            homeInfo={{
              name: homeTeam.team.name,
              img: getCricketImageUrl(homeTeam.team.imageUrl),
              matchesWon:
                homeTeam.team.id === item.result.leadTeam?.id
                  ? item.result.matchesWonByLeadTeam
                  : item.result.matchesWonByLoserTeam,
            }}
            awayInfo={{
              name: awayTeam.team.name,
              img: getCricketImageUrl(awayTeam.team.imageUrl),
              matchesWon:
                awayTeam.team.id === item.result.leadTeam?.id
                  ? item.result.matchesWonByLeadTeam
                  : item.result.matchesWonByLoserTeam,
            }}
          ></CricketSeriesResult>
        ))}

      {series.isTrophy && seriesResults?.results.length === 1 && (
        <div className="flex flex-col items-center">
          <p className="pt-6 dark:text-neutral-400">TOURNAMENT WINNER </p>
          <Image
            src={getCricketImageUrl(
              seriesResults.results[0].result.leadTeam.imageUrl,
            )}
            height={150}
            width={150}
            alt={"Winning Team"}
            className="m-4"
          />

          <p className="text-xl dark:text-neutral-400">
            {seriesResults.results[0].result.leadTeam.longName}{" "}
          </p>
        </div>
      )} */}

      {seriesLadders !== null &&
        seriesLadders.map((item) => (
          <CricketSeriesLadder key={item.name} data={item} />
        ))}

      {seriesLadders === null && <Placeholder>No Results</Placeholder>}
    </div>
  );
}
