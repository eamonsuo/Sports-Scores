import { fetchCricketSeriesStandings } from "@/api/cricket.api";
import CricketSeriesLadder from "@/components/cricket/CricketSeriesLadder";
import CricketSeriesResult from "@/components/cricket/CricketSeriesResult";
import Placeholder from "@/components/misc/Placeholder";
import { getCricketImageUrl } from "@/lib/projUtils";
import Image from "next/image";

export default async function Page(props: {
  params: Promise<{ slug: number }>;
}) {
  const params = await props.params;
  let url = "https://www.espncricinfo.com/series/" + params.slug;
  let scrape = await fetchCricketSeriesStandings(url);

  const series = scrape.series;
  const standings = scrape.content.standings;
  const seriesResults = scrape.content.seriesResults;

  let homeTeam = scrape.content.teams[0].isHome
    ? scrape.content.teams[0]
    : scrape.content.teams[1];
  let awayTeam = scrape.content.teams[0].isHome
    ? scrape.content.teams[1]
    : scrape.content.teams[0];

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {seriesResults !== null &&
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
      )}

      {series.isTrophy && standings !== null && (
        <>
          <CricketSeriesLadder data={standings} />

          <p className="pt-6 dark:text-neutral-400">
            {standings.notes.length > 0 && "Notes:"}{" "}
          </p>
          <p className="pt-3 dark:text-neutral-400">{standings.notes}</p>
        </>
      )}

      {(seriesResults === null || seriesResults.results.length === 0) &&
        standings === null && <Placeholder>No Results</Placeholder>}
    </div>
  );
}
