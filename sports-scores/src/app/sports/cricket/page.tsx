import MatchSummaryList from "@/components/generic/FixtureSummaryList";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import { fetchCricketFixtures } from "@/api/cricket.api";

export default async function Page() {
  const DAYSINPAST = 30; // Get records 30 days in the past
  const YEARSINFUTURE = 1; // Get records 1 year in the future

  const currentDate: Date = new Date(Date.now());
  const queryStartDate: Date = new Date(currentDate);
  queryStartDate.setDate(queryStartDate.getDate() - DAYSINPAST);
  const queryEndDate: Date = new Date(queryStartDate);
  queryEndDate.setFullYear(queryEndDate.getFullYear() + YEARSINFUTURE);

  let startDate = `${queryStartDate.getFullYear()}-${
    queryStartDate.getMonth() + 1
  }-${queryStartDate.getDate()}`;
  let endDate = `${queryEndDate.getFullYear()}-${
    queryEndDate.getMonth() + 1
  }-${queryEndDate.getDate()}`;

  const fixtures: MatchSummary[] = await fetchCricketFixtures(
    startDate,
    endDate,
  );

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
