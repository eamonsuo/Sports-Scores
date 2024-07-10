import MatchSummaryList from "@/components/generic/FixtureList";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import { cricinfoScraper } from "@/lib/scraper";
import { mapScrape } from "@/lib/dataMapping";

export default async function Page() {
  const DAYSINPAST = 30; // Get records 30 days in the past
  const YEARSINFUTURE = 1; // Get records 1 year in the future

  const currentDate = new Date(Date.now());
  const queryStartDate = new Date(currentDate);
  queryStartDate.setDate(queryStartDate.getDate() - DAYSINPAST);
  const queryEndDate = new Date(queryStartDate);
  queryEndDate.setFullYear(queryEndDate.getFullYear() + YEARSINFUTURE);

  let startDate = `${queryStartDate.getFullYear()}-${
    queryStartDate.getMonth() + 1
  }-${queryStartDate.getDate()}`;
  let endDate = `${queryEndDate.getFullYear()}-${
    queryEndDate.getMonth() + 1
  }-${queryEndDate.getDate()}`;

  // const fixtures: MatchSummary[] = await fetchCricketFixtures(
  //   startDate,
  //   endDate,
  // );

  const scrape = await cricinfoScraper();
  const fixtures = mapScrape(scrape);

  const pageOptions = [
    {
      btnLabel: "Matches",
      component: <MatchSummaryList data={fixtures} />,
      state: "matches",
    },
    {
      btnLabel: "Series",
      component: <div>Nothing to see here</div>,
      state: "series",
    },
  ];

  return <ClientSportsPage options={pageOptions} apiStatus={<></>} />;
}
