import {
  BaseballStanding,
  BaseballTeamStanding,
} from "@/components/baseball/BaseballLadder";
import { BaseballScoreBreakdown } from "@/components/baseball/BaseballScoreBreakdown";
import {
  fetchBaseballCurrentMatches as fetchBaseballByDateMatches,
  fetchBaseballLastMatches,
  fetchBaseballMatchDetails,
  fetchBaseballNextMatches,
  fetchBaseballStandings,
} from "@/endpoints/baseball.api";
import {
  fetchEventDetails,
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import { BASEBALL_LEAGUES } from "@/lib/constants";
import {
  getCurrentRound,
  mapFixtureRounds,
  mapMatchSummary,
} from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import {
  BaseballFixturesPage,
  BaseballLadderPage,
  BaseballMatchPage,
  BaseballTodayPage,
} from "@/types/baseball";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import { Sofascore_Event } from "@/types/sofascore";
import { TZDate } from "@date-fns/tz";
import { isSameDay } from "date-fns";

export async function baseballMatches(tournamentId: number, seasonId: number) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchLastEvents : fetchBaseballLastMatches
  )(tournamentId, seasonId, 0);

  const nextMatches = await (
    process.env.DEV_MODE ? fetchNextEvents : fetchBaseballNextMatches
  )(tournamentId, seasonId, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const allMatches = (lastMatches?.events ?? [])
    .concat(nextMatches?.events ?? [])
    .map((event) =>
      mapBaseballMatch(
        event,
        event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
      ),
    )
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const leagueConfig = BASEBALL_LEAGUES.find(
    (l) => Number(l.slug) === tournamentId,
  );

  const fixture = mapFixtureRounds(
    leagueConfig ?? { name: "", slug: "", seasons: [] },
    allMatches,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(
      leagueConfig?.display ?? DISPLAY_TYPES.ROUND,
      fixture,
    ),
  } as BaseballFixturesPage;
}

export async function baseballStandings(
  tournamentId: number,
  seasonId: number,
) {
  const standings = await (
    process.env.DEV_MODE ? fetchStandingsTotal : fetchBaseballStandings
  )(tournamentId, seasonId);

  if (!standings) {
    return null;
  }

  return {
    tables: standings?.standings
      .sort((a, b) => {
        const orderA = tableOrder(a.name);
        const orderB = tableOrder(b.name);
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name); // Alphabetical within group
      })
      .map((table) => {
        return {
          tableName: table.name,
          standings: table.rows.map((standing) => {
            return {
              position: standing.position,
              played: standing.wins + standing.losses,
              won: standing.wins,
              lost: standing.losses,
              pct: standing.percentage,
              team: {
                id: standing.team.id,
                name: shortenTeamNames(standing.team.name),
                logo: resolveSportImage(standing.team.name),
              },
            } as BaseballTeamStanding;
          }),
        } as BaseballStanding;
      }),
  } as BaseballLadderPage;
}

export async function baseballMatchDetails(matchId: number) {
  const match = await (
    process.env.DEV_MODE ? fetchEventDetails : fetchBaseballMatchDetails
  )(matchId);

  const matchDetails = match?.event;

  let scoreDetails = !matchDetails
    ? null
    : {
        status: matchDetails?.status.description,
        homeTeam: {
          name: shortenTeamNames(matchDetails.homeTeam.name),
          score: matchDetails?.homeScore?.current?.toString() ?? "0",
          img: resolveSportImage(matchDetails.homeTeam.name),
        },
        awayTeam: {
          name: shortenTeamNames(matchDetails?.awayTeam.name),
          score: matchDetails?.awayScore?.current?.toString() ?? "0",
          img: resolveSportImage(matchDetails.awayTeam.name),
        },

        scoreBreakdown: [
          {
            inning: "1",
            teams: {
              home: { score: matchDetails.homeScore?.period1 ?? "0" },
              away: { score: matchDetails.awayScore?.period1 ?? "0" },
            },
          },
          {
            inning: "2",
            teams: {
              home: { score: matchDetails.homeScore?.period2 ?? "0" },
              away: { score: matchDetails.awayScore?.period2 ?? "0" },
            },
          },
          {
            inning: "3",
            teams: {
              home: { score: matchDetails.homeScore?.period3 ?? "0" },
              away: { score: matchDetails.awayScore?.period3 ?? "0" },
            },
          },
          {
            inning: "4",
            teams: {
              home: { score: matchDetails.homeScore?.period4 ?? "0" },
              away: { score: matchDetails.awayScore?.period4 ?? "0" },
            },
          },
          {
            inning: "5",
            teams: {
              home: { score: matchDetails.homeScore?.period5 ?? "0" },
              away: { score: matchDetails.awayScore?.period5 ?? "0" },
            },
          },
          {
            inning: "6",
            teams: {
              home: { score: matchDetails.homeScore?.period6 ?? "0" },
              away: { score: matchDetails.awayScore?.period6 ?? "0" },
            },
          },
          {
            inning: "7",
            teams: {
              home: { score: matchDetails.homeScore?.period7 ?? "0" },
              away: { score: matchDetails.awayScore?.period7 ?? "0" },
            },
          },
          {
            inning: "8",
            teams: {
              home: { score: matchDetails.homeScore?.period8 ?? "0" },
              away: { score: matchDetails.awayScore?.period8 ?? "0" },
            },
          },
          {
            inning: "9",
            teams: {
              home: { score: matchDetails.homeScore?.period9 ?? "0" },
              away: { score: matchDetails.awayScore?.period9 ?? "0" },
            },
          },
        ] as BaseballScoreBreakdown[],
      };

  if (scoreDetails && matchDetails?.status.description === "AET") {
    scoreDetails.scoreBreakdown.push({
      inning: "Extra",
      teams: {
        home: {
          score:
            (matchDetails.homeScore?.current ?? 0) -
            (matchDetails.homeScore?.normaltime ?? 0),
        },
        away: {
          score:
            (matchDetails.awayScore?.current ?? 0) -
            (matchDetails.awayScore?.normaltime ?? 0),
        },
      },
    });
  }

  return {
    matchDetails: scoreDetails,
  } as BaseballMatchPage;
}

export async function baseballMatchesByDate(date: Date) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("baseball", date)
    : fetchBaseballByDateMatches(date));

  if (!matches) {
    return null;
  }

  const validLeagueIds = BASEBALL_LEAGUES.map((l) => Number(l.slug));

  const timezone = date instanceof TZDate ? date.timeZone : "UTC";

  matches.events = matches.events
    .filter((item) => {
      const eventDate = new TZDate(item.startTimestamp * 1000, timezone);
      return isSameDay(eventDate, date);
    })
    .filter((item) =>
      validLeagueIds.includes(item.tournament.uniqueTournament.id),
    )
    .sort((a, b) => a.startTimestamp - b.startTimestamp);

  if (!matches.events || matches.events.length === 0) return null;

  const allMatches = matches.events.map((event) =>
    mapBaseballMatch(
      event,
      event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
    ),
  );

  const fixture = mapFixtureRounds(BASEBALL_LEAGUES, allMatches);

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.LEAGUE, fixture),
  } as BaseballTodayPage;
}

// Custom sort: division < conference < MLB
function tableOrder(name: string): number {
  if (name === "MLB") return 2;
  if (name.split(" ").length == 2) return 1;
  return 0; // Division tables
}

function mapBaseballMatch(
  match: Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, SPORT.BASEBALL, match, {
    roundLabel,
  });
}
