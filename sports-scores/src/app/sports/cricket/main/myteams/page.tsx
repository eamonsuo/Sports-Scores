import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import FixtureList from "@/components/generic/FixtureList";
import { mapScrape } from "@/lib/dataMapping";
import { cricinfoTeamsScraper } from "@/lib/scraper";

export default async function Page() {
  const scrape = await cricinfoTeamsScraper();
  const fixtures = mapScrape(scrape);

  return <CricketFixtureList data={fixtures} />;
}
