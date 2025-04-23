import CricketMatchDetailsPage, {
  MatchDetailsPage,
} from "@/components/cricket/CricketMatchDetailsPage";
import CricketMatchScorecardPage from "@/components/cricket/CricketMatchScorecardPage";
import { CricketScorecardBatProps } from "@/components/cricket/CricketScorecardBat";
import { CricketScorecardBowlProps } from "@/components/cricket/CricketScorecardBowl";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import Placeholder from "@/components/misc/Placeholder";
import {
  fetchCricketMatchDetails,
  fetchCricketMatchInnings,
} from "@/endpoints/cricket.api";
import { convertNumbertoDate } from "@/lib/dataMapping";
import { dateToCustomString } from "@/lib/projUtils";
import {
  Cricket_LiveScoreAPI_MatchesGetInnings,
  Cricket_LiveScoreAPI_MatchesGetScoreBoard,
} from "@/types/cricket";
import Link from "next/link";
import { ReactNode } from "react";

type ScorecardPage = {
  data: {
    inningLabel: string;
    inningBatters: CricketScorecardBatProps;
    inningBowlers: CricketScorecardBowlProps;
  }[];
  matchState: "LIVE" | "COMPLETED";
};

export default async function Page(props: {
  params: Promise<{ slug: number }>;
}) {
  const params = await props.params;
  const rawInnings = await fetchCricketMatchInnings(params.slug);
  const rawDetails = await fetchCricketMatchDetails(params.slug);

  if (rawInnings === null || rawDetails === null) {
    return <Placeholder>An error has ocurred</Placeholder>;
  }

  const detailsPage = mapMatchDetails(rawDetails, rawInnings);
  const scorecardPage = mapScorecardDetails(rawInnings);
  let optionsOverall = pageSettings(detailsPage, scorecardPage, "");

  return (
    <ClientSportsPage
      apiStatus={<></>}
      options={optionsOverall}
      defaultState="scorecard"
    />
  );
}

function pageSettings(
  matchDetails: MatchDetailsPage,
  matchScorecard: ScorecardPage,
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
      component: seriesComponents(""),
      state: "series",
    },
  ];
}

function seriesComponents(series: string) {
  return (
    <Link href={`/sports/cricket/series/${series}/matches#current-date`}>
      <p className="m-4 rounded-md p-2 text-center dark:bg-neutral-700 dark:text-neutral-300">
        Go to Series Details - {series}
      </p>
    </Link>
  );
}

function mapMatchDetails(
  details: Cricket_LiveScoreAPI_MatchesGetScoreBoard,
  innings: Cricket_LiveScoreAPI_MatchesGetInnings,
) {
  let homePlayers =
    Object.keys(innings).length === 0
      ? ["No Team Data"]
      : innings.Prns.toSpliced(10, 11).map((item) => item.Snm);
  let awayPlayers =
    Object.keys(innings).length === 0
      ? ["No Team Data"]
      : innings.Prns.toSpliced(0, 11).map((item) => item.Snm);
  let startDate = dateToCustomString(convertNumbertoDate(details.Esd));
  let endDate = dateToCustomString(convertNumbertoDate(details.Ese));
  let dateString =
    details.Esd === details.Ese ? `${startDate}` : `${startDate} - ${endDate}`;
  let tossChoice = details.TCho === 1 ? "bat" : "bowl";
  let tossWinner = details.TPa === 1 ? details.T1[0].Nm : details.T2[0].Nm;
  let longFormat =
    (details.Tr1C1 && details.Tr1C2) || (details.Tr2C1 && details.Tr2C2);
  let home1Ing = `${details.Tr1CW1 ?? 0}/${details.Tr1C1 ?? 0}${details.Tr1CD1 === 1 ? "d" : ""}`;
  let away1Ing = `${details.Tr2CW1 ?? 0}/${details.Tr2C1 ?? 0}${details.Tr2CD1 === 1 ? "d" : ""}`;
  let home2Ing = longFormat
    ? ` & ${details.Tr1CW2 ?? 0}/${details.Tr1C2 ?? 0}${details.Tr1CD2 === 1 ? "d" : ""}`
    : "";
  let away2Ing = longFormat
    ? ` & ${details.Tr2CW2 ?? 0}/${details.Tr2C2 ?? 0}${details.Tr2CD2 === 1 ? "d" : ""}`
    : "";

  return {
    matchSummaryText: details.ECo,
    status: details.EpsL,
    date: dateString,
    venue: `${details.Venue.Vnm}, ${details.Stg.Cnm}`,
    tossResult: `${tossWinner} won the toss and chose to ${tossChoice}`,
    umpires: [""],
    pom: "",
    homeInfo: { name: details.T1[0].Nm, score: `${home1Ing}${home2Ing}` },
    homePlayers: homePlayers,
    awayInfo: { name: details.T2[0].Nm, score: `${away1Ing}${away2Ing}` },
    awayPlayers: awayPlayers,
  } as MatchDetailsPage;
}

function mapScorecardDetails(data: Cricket_LiveScoreAPI_MatchesGetInnings) {
  if (Object.keys(data).length === 0) {
    return {
      matchState: "LIVE",
      data: [],
    } as ScorecardPage;
  }

  const inningsData = data.SDInn.map((item) => {
    let inningTile = item.Ti.replace(" INN", "").split(" ");

    return {
      inningLabel: `${inningTile[1].toLowerCase()} ${inningTile[0]}`,
      inningBatters: {
        batters: item.Bat.map((x) => {
          return {
            name:
              data.Prns.find((p) => p.Pid === x.Pid.toString())?.Snm ??
              "Unknown",
            runs: x.R,
            balls: x.B,
            strikeRate: x.Sr,
            dismissalText:
              x.LpTx === "did not bat"
                ? ""
                : x.LpTx.replace(
                    "[F]",
                    data.Prns.find((p) => p.Pid === x.Fid.toString())?.Ln ??
                      "Unknown",
                  ).replace(
                    "[B]",
                    data.Prns.find((p) => p.Pid === x.Bid.toString())?.Ln ??
                      "Unknown",
                  ),
          };
        }),
        total: item.Pt,
        extras: {
          byes: item.B,
          legbyes: item.LB,
          noballs: item.NB,
          wides: item.WB,
          total: item.Ex,
        },
        overs: item.Ov,
        wickets: item.Wk,
      } as CricketScorecardBatProps,
      inningBowlers: item.Bow.map((bowl) => {
        return {
          name:
            data.Prns.find((p) => p.Pid === bowl.Pid.toString())?.Snm ??
            "Unknown",
          overs: bowl.Ov,
          runs: bowl.R,
          wickets: bowl.Wk,
          economy: bowl.Er,
        };
      }) as CricketScorecardBowlProps,
    };
  });

  return {
    matchState: "LIVE",
    data: inningsData,
  } as ScorecardPage;
}
