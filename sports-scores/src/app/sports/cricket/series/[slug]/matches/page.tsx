import { fetchCricketSeriesMatches } from "@/api/cricket.api";
import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import { mapScrape } from "@/lib/dataMapping";

export default async function Page(props: {
  params: Promise<{ slug: number }>;
}) {
  const params = await props.params;
  let url =
    "https://www.espncricinfo.com/series/" +
    params.slug +
    "/match-schedule-fixtures-and-results";
  let scrape = await fetchCricketSeriesMatches(url);

  let fixtures = mapScrape(scrape);

  return <CricketFixtureList data={fixtures} />;
}
