import CricketMatchDetails from "@/components/cricket/CricketMatchDetails";
import CricketScorecardBat from "@/components/cricket/CricketScorecardBat";
import CricketScorecardBowl from "@/components/cricket/CricketScorecardBowl";
import ClientSportsPage from "@/components/generic/ClientSportsPage";
import MatchDetailsHero from "@/components/generic/MatchDetailsHero";
import Placeholder from "@/components/misc/Placeholder";
import { cricinfoMatchDetails } from "@/lib/scraper";
import { getCricketImageUrl, getLocalTimeISO } from "@/lib/utils";
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string[] } }) {
  let url =
    "https://www.espncricinfo.com/series/" +
    params.slug.join("/") +
    "/full-scorecard";
  let scrape = await cricinfoMatchDetails(url);
  let homeTeam = scrape.match.teams[0].isHome
    ? scrape.match.teams[0]
    : scrape.match.teams[1];
  let awayTeam = scrape.match.teams[0].isHome
    ? scrape.match.teams[1]
    : scrape.match.teams[0];

  let homeTeamPlayers = scrape.content.matchPlayers?.teamPlayers[0].team.isHome
    ? scrape.content.matchPlayers?.teamPlayers[0]
    : scrape.content.matchPlayers?.teamPlayers[1];
  let awayTeamPlayers = scrape.content.matchPlayers?.teamPlayers[0].team.isHome
    ? scrape.content.matchPlayers?.teamPlayers[1]
    : scrape.content.matchPlayers?.teamPlayers[0];

  let homeInnings = 1;
  let awayInnings = 1;

  let optionsScorecard = scrape.content.innings.map((item) => {
    return {
      btnLabel: `${homeTeam.team.id === item.team.id ? (homeInnings++ === 1 ? "1st " : "2nd ") : awayInnings++ === 1 ? "1st " : "2nd "} ${item.team.abbreviation}`,
      component: (
        <div className="px-4">
          <CricketScorecardBat
            batters={item.inningBatsmen}
            total={item.runs}
            overs={item.overs}
          />
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
      component: (
        <>
          <MatchDetailsHero
            status={
              scrape.match.status === "{{MATCH_START_TIME}}"
                ? "Scheduled"
                : scrape.match.status
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
          <CricketMatchDetails
            date={
              new Date(scrape.match.startTime).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "Australia/Brisbane",
              }) +
              " " +
              getLocalTimeISO(scrape.match.startTime)
            }
            venue={scrape.match.ground.longName}
            toss={
              (scrape.match.teams.find(
                (item) => item.team.id === scrape.match.tossWinnerTeamId,
              )?.team.name ?? "NA") +
              (scrape.match.tossWinnerChoice === 1 ? " - Chose to Bat" : "") +
              (scrape.match.tossWinnerChoice === 2 ? " - Chose to Bowl" : "")
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
              scrape.match.umpires?.map(
                (item) => item.player.battingName + ", ",
              ) ?? ["NA"]
            }
            pom={
              scrape.content.matchPlayerAwards?.find(
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
      component: (
        <Link
          href={`/sports/cricket/series/${scrape.match.series.slug}-${scrape.match.series.objectId}/matches#current-date`}
        >
          <p className="m-4 rounded-md p-2 text-center dark:bg-neutral-700 dark:text-neutral-300">
            Go to Series Details - {scrape.match.series.longName}
          </p>
        </Link>
      ),
      state: "series",
    },
  ];

  return (
    <ClientSportsPage
      apiStatus={<></>}
      options={optionsOverall}
      defaultState="scorecard"
    />
  );
}
