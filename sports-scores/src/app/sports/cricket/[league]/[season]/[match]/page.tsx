import ClientSportsPage from "@/components/all-sports/ClientSportsPage";
import CricketMatchDetailsPage, {
  MatchDetailsPage,
} from "@/components/cricket/CricketMatchDetailsPage";
import CricketMatchScorecardPage from "@/components/cricket/CricketMatchScorecardPage";
import { CricketScorecardBatProps } from "@/components/cricket/CricketScorecardBat";
import { CricketScorecardBowlProps } from "@/components/cricket/CricketScorecardBowl";
import Placeholder from "@/components/misc-ui/Placeholder";
import { cricketMatchDetails } from "@/services/cricket.service";
import Link from "next/link";
import { ReactNode } from "react";

export type CricketScorecardPage = {
  data: {
    inningLabel: string;
    inningBatters: CricketScorecardBatProps;
    inningBowlers: CricketScorecardBowlProps;
  }[];
  matchState: "LIVE" | "COMPLETED";
};

export default async function Page(props: {
  params: Promise<{ league: string; season: string; match: string }>;
}) {
  const { league, season, match } = await props.params;
  const rawDetails = await cricketMatchDetails(Number(match));

  if (rawDetails === null) {
    return <Placeholder>An error has ocurred</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ClientSportsPage
        apiStatus={<></>}
        options={pageSettings(
          rawDetails.matchDetails,
          rawDetails.matchScorecard,
          rawDetails.matchSeries,
        )}
        defaultState="scorecard"
      />
    </div>
  );
}

function pageSettings(
  matchDetails: MatchDetailsPage,
  matchScorecard: CricketScorecardPage,
  matchSeries: string,
): {
  btnLabel: string;
  component: ReactNode;
  state: string;
}[] {
  return [
    {
      btnLabel: `Details`,
      component: <CricketMatchDetailsPage matchDetails={matchDetails} />,
      state: "details",
    },
    {
      btnLabel: `Scorecard`,
      component: (
        <CricketMatchScorecardPage
          data={matchScorecard.data}
          matchState={matchScorecard.matchState}
        />
      ),
      state: "scorecard",
    },
    {
      btnLabel: `Commentry`,
      component: <Placeholder>Coming Soon</Placeholder>, //TODO: Add Commentry
      state: "commentry",
    },
    {
      btnLabel: `Series`,
      component: seriesComponents(matchSeries),
      state: "series",
    },
  ];
}

function seriesComponents(series: string) {
  return (
    <Link href={`/sports/cricket/${series}/matches#current-date`}>
      <p className="m-4 rounded-md p-2 text-center dark:bg-neutral-700 dark:text-neutral-300">
        Go to Series Details - {series}
      </p>
    </Link>
  );
}
