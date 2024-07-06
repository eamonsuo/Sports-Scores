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
import { redirect } from "next/navigation";

export default async function Page() {
  const fixtures = await fetchAFLFixtures("2024");
  const status = await fetchAFLStatus();
  const standings = await fetchAFLStandings("2024");

  //TODO: Fix error handling for rate limit
  if (fixtures[0] === undefined || status.account === undefined) {
    redirect("/misc/rateLimit");
  }

  const mappedFixtures = mapAflFixtureFields(fixtures);
  let curRound = getCurrentWeek(mappedFixtures);

  const pageOptions = [
    {
      btnLabel: "Matches",
      component: <FixtureRoundList data={mappedFixtures} curRound={curRound} />,
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
