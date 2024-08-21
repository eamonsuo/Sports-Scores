import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import { mapScrape } from "@/lib/dataMapping";
import { cricinfoSeriesMatchesScraper } from "@/lib/scraper";

export default async function Page({ params }: { params: { slug: number } }) {
  let url =
    "https://www.espncricinfo.com/series/" +
    params.slug +
    "/match-schedule-fixtures-and-results";
  let scrape = await cricinfoSeriesMatchesScraper(url);

  let fixtures = mapScrape(scrape);

  return <CricketFixtureList data={fixtures} />;
}
