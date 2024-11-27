import { fetchCricketMatch } from "@/api/cricket.api";
import CricketMatchSummary from "@/components/cricket/CricketMatchSummary";
import CricketScorecardBat from "@/components/cricket/CricketScorecardBat";
import CricketScorecardBowl from "@/components/cricket/CricketScorecardBowl";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import Placeholder from "@/components/misc/Placeholder";
import { getCricketImageUrl, getLocalTimeISO } from "@/lib/projUtils";
import { CricketMatchDetails, Team, TeamPlayer } from "@/types/cricket";
import Link from "next/link";

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

  let homeInnings = 1;
  let awayInnings = 1;

  let optionsOverall = buildOptions(
    scrape,
    homeTeam,
    homeInnings,
    awayTeam,
    awayInnings,
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

function createScorecards(
  scrape: CricketMatchDetails,
  homeTeam: Team,
  homeInnings: number,
  awayTeam: Team,
  awayInnings: number,
) {
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
          />
          <div className="py-6"></div>
          <CricketScorecardBowl data={item.inningBowlers} />
        </div>
      ),
      state: item.inningNumber.toString(),
    };
  });
}

function buildOptions(
  scrape: CricketMatchDetails,
  homeTeam: Team,
  homeInnings: number,
  awayTeam: Team,
  awayInnings: number,
  homeTeamPlayers?: TeamPlayer,
  awayTeamPlayers?: TeamPlayer,
) {
  let scrapeData = scrape.data;

  let optionsScorecard = createScorecards(
    scrape,
    homeTeam,
    homeInnings,
    awayTeam,
    awayInnings,
  );

  return [
    {
      btnLabel: `Details`,
      component: (
        <>
          <p className="my-2 text-center text-xl text-neutral-400">
            {scrapeData.match.statusText}
          </p>
          <MatchDetailsHero
            status={
              scrapeData.match.status === "{{MATCH_START_TIME}}"
                ? "Scheduled"
                : scrapeData.match.status
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
              new Date(scrapeData.match.startTime).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "Australia/Brisbane",
              }) +
              " " +
              getLocalTimeISO(scrapeData.match.startTime)
            }
            venue={scrapeData.match.ground.longName}
            toss={
              (scrapeData.match.teams.find(
                (item) => item.team.id === scrapeData.match.tossWinnerTeamId,
              )?.team.name ?? "NA") +
              (scrapeData.match.tossWinnerChoice === 1
                ? " - Chose to Bat"
                : "") +
              (scrapeData.match.tossWinnerChoice === 2
                ? " - Chose to Bowl"
                : "")
            }
            homePlayers={
              homeTeamPlayers?.players.map(
                (item) =>
                  item.player.battingName +
                  (item.playerRoleType !== "P"
                    ? ` (${item.playerRoleType})`
                    : "") +
                  ", ",
              ) ?? ["NA"]
            }
            awayPlayers={
              awayTeamPlayers?.players.map(
                (item) =>
                  item.player.battingName +
                  (item.playerRoleType !== "P"
                    ? ` (${item.playerRoleType})`
                    : "") +
                  ", ",
              ) ?? ["NA"]
            }
            umpires={
              scrapeData.match.umpires?.map(
                (item) => item.player.battingName + ", ",
              ) ?? ["NA"]
            }
            pom={
              scrapeData.content.matchPlayerAwards?.find(
                (item) => item.type === "PLAYER_OF_MATCH",
              )?.player.name ?? "NA"
            }
          />
        </>
      ),
      state: "details",
    },
    {
      btnLabel: `Scorecard`,
      component:
        scrapeData.content.innings.length === 0 ? (
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
      component: (
        <Link
          href={`/sports/cricket/series/${scrapeData.match.series.slug}-${scrapeData.match.series.objectId}/matches#current-date`}
        >
          <p className="m-4 rounded-md p-2 text-center dark:bg-neutral-700 dark:text-neutral-300">
            Go to Series Details - {scrapeData.match.series.longName}
          </p>
        </Link>
      ),
      state: "series",
    },
  ];
}
