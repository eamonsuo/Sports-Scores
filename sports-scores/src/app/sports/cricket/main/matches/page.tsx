import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import { mapScrape } from "@/lib/dataMapping";
import { cricinfoLiveMatchesScraper } from "@/lib/scraper";

export const dynamic = "force-dynamic";

export default async function Page() {
  const scrape = await cricinfoLiveMatchesScraper();

  // for (let i = 0; i < scrape.length; i++) {
  //   let url =
  //     "https://www.espncricinfo.com/series/" +
  //     scrape[i].series.slug +
  //     "-" +
  //     scrape[i].series.objectId +
  //     "/" +
  //     scrape[i].slug +
  //     "-" +
  //     scrape[i].objectId +
  //     "/full-scorecard";

  //   console.log("DEV ---", url);
  //   let matchDetails =
  //     await scrapeData<CricinfoResponse<CricketMatchDetails>>(url);

  //   scrape[i].teams[0].score =
  //     await matchDetails.props.appPageProps.data.match.teams[0].score;
  //   scrape[i].teams[1].score =
  //     await matchDetails.props.appPageProps.data.match.teams[1].score;
  // }

  const fixtures = mapScrape(scrape);

  return <CricketFixtureList data={fixtures} />;
}
