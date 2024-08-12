import CricketScorecardBat from "@/components/cricket/CricketScorecardBat";
import CricketScorecardBowl from "@/components/cricket/CricketScorecardBowl";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import { cricinfoMatchDetails } from "@/lib/scraper";
import React from "react";

export default async function Page({ params }: { params: { slug: string[] } }) {
  let url =
    "https://www.espncricinfo.com/series/" +
    params.slug.join("/") +
    "/full-scorecard";
  let scrape = await cricinfoMatchDetails(url);

  let optionsScorecard = scrape.content.innings.map((item) => {
    return {
      btnLabel: `Innings ${item.inningNumber}`,
      component: (
        <div className="px-4">
          <CricketScorecardBat data={item.inningBatsmen} />
          <div className="py-6"></div>
          <CricketScorecardBowl data={item.inningBowlers} />
        </div>
      ),
      state: item.inningNumber.toString(),
    };
  });

  let optionsOverall = [
    {
      btnLabel: `Details`,
      component: <p className="text-center">coming soon</p>,
      state: "details",
    },
    {
      btnLabel: `Scorecard`,
      component: (
        <ClientSportsPage
          apiStatus={<></>}
          options={optionsScorecard}
          defaultState="1"
        />
      ),
      state: "scorecard",
    },
    {
      btnLabel: `Commentry`,
      component: <p className="text-center">coming soon</p>,
      state: "commentry",
    },
  ];

  return (
    <ClientSportsPage
      apiStatus={<></>}
      options={optionsOverall}
      defaultState="scorecard"
    />
    // <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 dark:text-neutral-400">
    //   <p>
    //     {scrape.content.innings[0].team.longName} Innings{" "}
    //     {scrape.content.innings[0].inningNumber}
    //   </p>
    //   <CricketScorecardBat data={scrape.content.innings[0].inningBatsmen} />
    //   <CricketScorecardBowl data={scrape.content.innings[0].inningBowlers} />
    // </div>
  );
}
