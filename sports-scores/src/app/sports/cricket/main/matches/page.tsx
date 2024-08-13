import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import { mapScrape } from "@/lib/dataMapping";
import { cricinfoMatchesScraper } from "@/lib/scraper";

export default async function Page() {
  const scrape = await cricinfoMatchesScraper();
  const fixtures = mapScrape(scrape);

  return <CricketFixtureList data={fixtures} />;
}
