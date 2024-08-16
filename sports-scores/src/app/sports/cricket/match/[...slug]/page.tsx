import CricketScorecardBat from "@/components/cricket/CricketScorecardBat";
import CricketScorecardBowl from "@/components/cricket/CricketScorecardBowl";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import Placeholder from "@/components/misc/Placeholder";
import { cricinfoMatchDetails } from "@/lib/scraper";

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
      component: <Placeholder>Coming Soon</Placeholder>,
      state: "details",
    },
    {
      btnLabel: `Scorecard`,
      component:
        scrape.content.innings.length === 0 ? (
          <Placeholder>No Scorecard Details</Placeholder>
        ) : (
          <ClientSportsPage
            apiStatus={<></>}
            options={optionsScorecard}
            defaultState={optionsScorecard[0].state}
          />
        ),
      state: "scorecard",
    },
    {
      btnLabel: `Commentry`,
      component: <Placeholder>Coming Soon</Placeholder>,
      state: "commentry",
    },
    {
      btnLabel: `Series`,
      component: <Placeholder>Coming Soon</Placeholder>,
      state: "series",
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
