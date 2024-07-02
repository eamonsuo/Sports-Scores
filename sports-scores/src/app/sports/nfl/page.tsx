import {
  fetchNFLFixtures,
  fetchNFLStandings,
  fetchNFLStatus,
} from "@/api/nfl.api";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import FixtureRoundList from "@/components/generic/FixtureRoundList";
import FixtureSummaryList from "@/components/generic/FixtureSummaryList";
import NFLLadder from "@/components/nfl/NFLLadder";
import APIStatus from "@/components/ui/ApiStatus";
import { mapNFLFixtureFields } from "@/lib/utils";

export default async function Page() {
  const fixtures = await fetchNFLFixtures("2024");
  const status = await fetchNFLStatus();
  const standings = await fetchNFLStandings("2024");

  const mappedFixtures = mapNFLFixtureFields(fixtures);
  //   let curRound = getCurrentWeek(mappedFixtures);

  let labels = [
    ...new Set(mappedFixtures.map((item) => item.roundLabel ?? "")),
  ];
  console.log(labels);

  const pageOptions = [
    {
      btnLabel: "Matches",
      component: (
        <FixtureRoundList
          data={mappedFixtures}
          rounds={labels}
          curRound="Pre - HOF Weekend"
        />
      ),
      state: "matches",
    },
    {
      btnLabel: "Ladder",
      component: <NFLLadder data={standings} />,
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
