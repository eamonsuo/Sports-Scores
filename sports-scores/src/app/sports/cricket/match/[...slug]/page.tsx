import { fetchCricketMatch } from "@/api/cricket.api";
import CricketMatchSummary from "@/components/cricket/CricketMatchSummary";
import CricketScorecardBat from "@/components/cricket/CricketScorecardBat";
import CricketScorecardBowl from "@/components/cricket/CricketScorecardBowl";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import Placeholder from "@/components/misc/Placeholder";
import { getCricketImageUrl, getLocalTimeISO } from "@/lib/projUtils";
import {
  CricketMatch,
  CricketMatchDetails,
  CricketSeries,
  Team,
  TeamPlayer,
} from "@/types/cricket";
import Link from "next/link";
import { ReactNode } from "react";

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  let url =
    "https://www.espncricinfo.com/series/" +
    params.slug.join("/") +
    "/full-scorecard";
  let scrape = await fetchCricketMatch(url);

  let scrapeData = scrape.data;

  let homeTeam = scrapeData.match.teams[0].isHome
    ? scrapeData.match.teams[0]
    : scrapeData.match.teams[1];
  let awayTeam = scrapeData.match.teams[0].isHome
    ? scrapeData.match.teams[1]
    : scrapeData.match.teams[0];

  let homeTeamPlayers = scrapeData.content.matchPlayers?.teamPlayers[0].team
    .isHome
    ? scrapeData.content.matchPlayers?.teamPlayers[0]
    : scrapeData.content.matchPlayers?.teamPlayers[1];
  let awayTeamPlayers = scrapeData.content.matchPlayers?.teamPlayers[0].team
    .isHome
    ? scrapeData.content.matchPlayers?.teamPlayers[1]
    : scrapeData.content.matchPlayers?.teamPlayers[0];

  let optionsOverall = pageSettings(
    scrape,
    homeTeam,
    awayTeam,
    homeTeamPlayers,
    awayTeamPlayers,
  );

  return (
    <ClientSportsPage
      apiStatus={<></>}
      options={optionsOverall}
      defaultState="scorecard"
    />
  );
}

function detailsComponents(
  match: CricketMatch,
  homeTeam: Team,
  awayTeam: Team,
  matchPlayerAwards: any[],
  homeTeamPlayers?: TeamPlayer,
  awayTeamPlayers?: TeamPlayer,
) {
  return (
    <>
      <p className="my-2 text-center text-xl text-neutral-400">
        {match.statusText}
      </p>
      <MatchDetailsHero
        status={
          match.status === "{{MATCH_START_TIME}}" ? "Scheduled" : match.status
        }
        homeInfo={{
          img: getCricketImageUrl(homeTeam.team.imageUrl),
          score: `${homeTeam?.score ?? "0"}`,
          name: homeTeam.team.name,
        }}
        awayInfo={{
          img: getCricketImageUrl(awayTeam.team.imageUrl),
          score: `${awayTeam?.score ?? "0"}`,
          name: awayTeam.team.name,
        }}
      />
      <CricketMatchSummary
        date={
          new Date(match.startTime).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "Australia/Brisbane",
          }) +
          " " +
          getLocalTimeISO(match.startTime)
        }
        venue={match.ground.longName}
        toss={
          (match.teams.find((item) => item.team.id === match.tossWinnerTeamId)
            ?.team.name ?? "NA") +
          (match.tossWinnerChoice === 1 ? " - Chose to Bat" : "") +
          (match.tossWinnerChoice === 2 ? " - Chose to Bowl" : "")
        }
        homePlayers={
          homeTeamPlayers?.players.map(
            (item) =>
              item.player.battingName +
              (item.playerRoleType !== "P" ? ` (${item.playerRoleType})` : "") +
              ", ",
          ) ?? ["NA"]
        }
        awayPlayers={
          awayTeamPlayers?.players.map(
            (item) =>
              item.player.battingName +
              (item.playerRoleType !== "P" ? ` (${item.playerRoleType})` : "") +
              ", ",
          ) ?? ["NA"]
        }
        umpires={
          match.umpires?.map((item) => item.player.battingName + ", ") ?? ["NA"]
        }
        pom={
          matchPlayerAwards?.find((item) => item.type === "PLAYER_OF_MATCH")
            ?.player.name ?? "NA"
        }
      />
    </>
  );
}

function scorecardComponents(scrape: CricketMatchDetails, homeTeam: Team) {
  let scorecards = createScorecardComponents(scrape, homeTeam);

  return scrape.data.content.innings.length === 0 ? (
    <Placeholder>No Scorecard Details</Placeholder>
  ) : (
    <ClientSportsPage
      apiStatus={<></>}
      options={scorecards}
      defaultState={
        scrape.data.match.state === "LIVE"
          ? scorecards[scorecards.length - 1].state
          : scorecards[0].state
      }
    />
  );
}

function createScorecardComponents(
  scrape: CricketMatchDetails,
  homeTeam: Team,
) {
  let homeInnings = 1;
  let awayInnings = 1;

  return scrape.data.content.innings.map((item) => {
    return {
      btnLabel: `${homeTeam.team.id === item.team.id ? (homeInnings++ === 1 ? "1st " : "2nd ") : awayInnings++ === 1 ? "1st " : "2nd "} ${item.team.abbreviation}`,
      component: (
        <div className="px-4">
          <CricketScorecardBat
            batters={item.inningBatsmen}
            total={item.runs}
            overs={item.overs}
            wickets={item.wickets ?? 0}
            extras={{
              total: item.extras,
              byes: item.byes,
              legbyes: item.legbyes,
              noballs: item.noballs,
              wides: item.wides,
            }}
          />
          <div className="py-6"></div>
          <CricketScorecardBowl data={item.inningBowlers} />
        </div>
      ),
      state: item.inningNumber.toString(),
    };
  });
}

function seriesComponents(series: CricketSeries) {
  return (
    <Link
      href={`/sports/cricket/series/${series.slug}-${series.objectId}/matches#current-date`}
    >
      <p className="m-4 rounded-md p-2 text-center dark:bg-neutral-700 dark:text-neutral-300">
        Go to Series Details - {series.longName}
      </p>
    </Link>
  );
}

function pageSettings(
  scrape: CricketMatchDetails,
  homeTeam: Team,
  awayTeam: Team,
  homeTeamPlayers?: TeamPlayer,
  awayTeamPlayers?: TeamPlayer,
): {
  btnLabel: string;
  component: ReactNode;
  state: string;
}[] {
  return [
    {
      btnLabel: `Details`,
      component: detailsComponents(
        scrape.data.match,
        homeTeam,
        awayTeam,
        scrape.data.content.matchPlayerAwards,
        homeTeamPlayers,
        awayTeamPlayers,
      ),
      state: "details",
    },
    {
      btnLabel: `Scorecard`,
      component: scorecardComponents(scrape, homeTeam),
      state: "scorecard",
    },
    {
      btnLabel: `Commentry`,
      component: <Placeholder>Coming Soon</Placeholder>,
      state: "commentry",
    },
    {
      btnLabel: `Series`,
      component: seriesComponents(scrape.data.match.series),
      state: "series",
    },
  ];
}
