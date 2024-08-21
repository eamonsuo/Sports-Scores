import CricketSeriesLadder from "@/components/cricket/CricketSeriesLadder";
import CricketSeriesResult from "@/components/cricket/CricketSeriesResult";
import Placeholder from "@/components/misc/Placeholder";
import { cricinfoSeriesStandingsScraper } from "@/lib/scraper";
import { getCricketImageUrl } from "@/lib/utils";

export default async function Page({ params }: { params: { slug: number } }) {
  let url = "https://www.espncricinfo.com/series/" + params.slug;
  let scrape = await cricinfoSeriesStandingsScraper(url);

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

      {series.isTrophy && standings !== null && (
        <>
          <CricketSeriesLadder data={standings} />

          <p className="pt-6 dark:text-neutral-400">Notes: </p>
          <p className="pt-3 dark:text-neutral-400">{standings.notes}</p>
        </>
      )}

      {(seriesResults === null || seriesResults.results.length === 0) &&
        standings === null && <Placeholder>No Results</Placeholder>}
    </div>
  );
}