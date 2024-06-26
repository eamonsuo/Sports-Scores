import {
  fetchAFLFixtures,
  fetchAFLStandings,
  fetchAFLStatus,
} from "@/api/afl.api";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import APIStatus from "@/components/ui/ApiStatus";
import Ladder from "@/components/afl/AFLLadder";
import { getCurrentWeek, mapAflFixtureFields } from "@/lib/utils";
import FixtureRoundList from "@/components/generic/FixtureRoundList";

export default async function Page() {
  const fixtures = await fetchAFLFixtures("2024");
  const status: APISportsStatusDetails = await fetchAFLStatus();
  const standings: AFLStanding[] = await fetchAFLStandings("2024");

  const mappedFixtures = mapAflFixtureFields(fixtures);
  let curRound = getCurrentWeek(mappedFixtures);

  const pageOptions = [
    {
      btnLabel: "Matches",
      component: (
        <FixtureRoundList
          data={mappedFixtures}
          rounds={24}
          startingRound={0}
          curRound={curRound ?? 0}
        />
      ),
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
