import MatchSummaryList from "@/components/summary-page/MatchSummaryList";
import {
  fetchAFLFixtures,
  fetchAFLStandings,
  fetchAFLStatus,
} from "@/api/afl.api";
import ClientSportsPage from "@/components/summary-page/ClientSportsPage";
import APIStatus from "@/components/ui/ApiStatus";
import Ladder from "@/components/summary-page/Ladder";
import { mapAflFixtureFields } from "@/lib/utils";

export default async function Page() {
  const fixtures = await fetchAFLFixtures("2024");
  const status: APISportsStatusDetails = await fetchAFLStatus();
  const standings: AFLStanding[] = await fetchAFLStandings("2024");

  const pageOptions = [
    {
      btnLabel: "Matches",
      component: <MatchSummaryList data={mapAflFixtureFields(fixtures)} />,
      state: "matches",
    },
    {
      btnLabel: "Ladder",
      component: <Ladder data={standings} />,
      state: "ladder",
    },
  ];

  return (
    <ClientSportsPage
      options={pageOptions}
      apiStatus={<APIStatus data={status} />}
    />
  );
}
