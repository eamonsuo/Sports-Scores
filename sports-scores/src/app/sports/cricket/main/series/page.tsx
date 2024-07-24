import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import FixtureList from "@/components/generic/FixtureList";
import { mapScrape } from "@/lib/dataMapping";
import { cricinfoSeriesScraper } from "@/lib/scraper";

export default async function Page() {
  const scrape = await cricinfoSeriesScraper();

  return scrape.map((item) => (
    <p className="text-center" key={item.id}>
      {item.longName}
    </p>
  ));
}
