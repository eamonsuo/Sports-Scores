import FixtureList from "@/components/generic/FixtureList";
import { mapScrape } from "@/lib/dataMapping";
import { cricinfoScraper } from "@/lib/scraper";

export default async function Page() {
  const scrape = await cricinfoScraper();
  const fixtures = mapScrape(scrape);

  return <FixtureList data={fixtures} />;
}
