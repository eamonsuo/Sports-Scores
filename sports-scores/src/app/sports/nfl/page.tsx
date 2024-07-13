// import {
//   fetchNFLFixtures,
//   fetchNFLStandings,
//   fetchNFLStatus,
// } from "@/api/nfl.api";
// import ClientSportsPage from "@/components/generic/ClientSportsPage";
// import FixtureRoundList from "@/components/generic/FixtureRoundList";
// import NFLLadder from "@/components/nfl/NFLLadder";
// import APIStatus from "@/components/ui/ApiStatus";
// import { getCurrentWeek, mapNFLFixtureFields } from "@/lib/utils";

import { redirect } from "next/navigation";

export default async function Page() {
  // const fixtures = await fetchNFLFixtures(2024);
  // const status = await fetchNFLStatus();
  // const standings = await fetchNFLStandings(2024);

  // const mappedFixtures = mapNFLFixtureFields(fixtures);
  // let curRound = getCurrentWeek(mappedFixtures);

  // const pageOptions = [
  //   {
  //     btnLabel: "Matches",
  //     component: <FixtureRoundList data={mappedFixtures} curRound={curRound} />,
  //     state: "matches",
  //   },
  //   {
  //     btnLabel: "z",
  //     component: <NFLLadder data={standings} />,
  //     state: "ladder",
  //   },
  // ];

  // return (
  //   <ClientSportsPage
  //     options={pageOptions}
  //     apiStatus={<APIStatus data={status} />}
  //   />
  // );
  redirect("/main/matches");
}
