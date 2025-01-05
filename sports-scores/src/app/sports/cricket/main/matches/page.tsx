import { fetchCricketCurrentMatches } from "@/api/cricket.api";
import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import { mapScrape } from "@/lib/dataMapping";

export const dynamic = "force-dynamic";

export default async function Page() {
  const scrape = await fetchCricketCurrentMatches();

  const fixtures = mapScrape(scrape);

  return <CricketFixtureList data={fixtures} />;
}
