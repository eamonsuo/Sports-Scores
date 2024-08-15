import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import { mapScrape } from "@/lib/dataMapping";
import { cricinfoLiveMatchesScraper } from "@/lib/scraper";

export default async function Page() {
  const scrape = await cricinfoLiveMatchesScraper();
  const fixtures = mapScrape(scrape);

  return <CricketFixtureList data={fixtures} />;
}
