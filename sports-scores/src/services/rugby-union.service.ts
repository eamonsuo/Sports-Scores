import { RugbyUnionStanding } from "@/components/rugby-union/RugbyUnionLadder";
import {
  fetchRugbyLeagueLastMatches,
  fetchRugbyLeagueMatchDetails,
  fetchRugbyLeagueMatchesByDate,
  fetchRugbyLeagueMatchIncidents,
  fetchRugbyLeagueNextMatches,
  fetchRugbyLeagueStandings,
} from "@/endpoints/rugby-league.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import {
  RUGBY_UNION_LEAGUES,
  SUPER_RUGBY_TEAMS_NAME_LOGO,
} from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import {
  getCurrentRound,
  mapFixtureRound,
  mapMatchSummary,
  shortenTeamNames,
} from "@/lib/projUtils";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import {
  RugbyUnionFixturesPage,
  RugbyUnionLadderPage,
  RugbyUnionMatchPage,
  RugbyUnionTodayPage,
} from "@/types/rugby-union";
import { Sofascore_Event } from "@/types/sofascore";

export async function rugbyUnionMatches(
  tournamentId: number,
  seasonId: number,
) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchLastEvents : fetchRugbyLeagueLastMatches
  )(tournamentId, seasonId, 0);
  const nextMatches = await (
    process.env.DEV_MODE ? fetchNextEvents : fetchRugbyLeagueNextMatches
  )(tournamentId, seasonId, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  const fixture = mapFixtureRound(
    API_EVENT_TYPES.SOFASCORE,
    DISPLAY_TYPES.ROUND,
    matches,
    mapRugbyUnionMatch,
    tournamentId === 422,
    SUPER_RUGBY_TEAMS_NAME_LOGO,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.ROUND, fixture),
  } as RugbyUnionFixturesPage;
}

export async function rugbyUnionStandings(
  tournamentId: number,
  seasonId: number,
) {
  const standings = await (
    process.env.DEV_MODE ? fetchStandingsTotal : fetchRugbyLeagueStandings
  )(tournamentId, seasonId);

  if (!standings) {
    return null;
  }

  return {
    standings: standings?.standings.map((table) =>
      table.rows.map((item) => {
        return {
          position: item.position,
          points: item.points,
          team: {
            id: item.team.id,
            name: shortenTeamNames(item.team.name),
            logo: resolveSportImage(item.team.name),
          },
          games: {
            played: item.matches,
            win: item.wins,
            lost: item.losses,
            drawn: item.draws,
          },
          scores: { against: item.scoresAgainst, for: item.scoresFor },
          bonusPoints:
            (item.points ?? 0) - item.wins * 4 - (item.draws ?? 0) * 2,
        } as RugbyUnionStanding;
      }),
    ),
    qualifyingPosition:
      RUGBY_UNION_LEAGUES.find((l) => Number(l.slug) === tournamentId)
        ?.qualifyingPosition ?? -1,
  } as RugbyUnionLadderPage;
}

export async function rugbyUnionMatchDetails(matchId: number) {
  const match = await (
    process.env.DEV_MODE ? fetchEventDetails : fetchRugbyLeagueMatchDetails
  )(matchId);
  const incidents = await (
    process.env.DEV_MODE ? fetchEventIncidents : fetchRugbyLeagueMatchIncidents
  )(matchId);

  const matchDetails = match?.event;
  const scoreIncidents = incidents?.incidents
    ? incidents?.incidents
        .filter((item) => item.incidentType === "goal")
        .toReversed()
    : null;

  return {
    scoreEvents: !scoreIncidents
      ? null
      : scoreIncidents.map((item) => {
          return {
            event: item.incidentClass,
            difference: (item.homeScore ?? 0) - (item.awayScore ?? 0),
          };
        }),
    matchDetails: !matchDetails
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
              periodName: "1st Half",
              teams: {
                home: { score: matchDetails.homeScore?.period1 ?? "0" },
                away: { score: matchDetails.awayScore?.period1 ?? "0" },
              },
            },
            {
              periodName: "2nd Half",
              teams: {
                home: { score: matchDetails.homeScore?.period2 ?? "0" },
                away: { score: matchDetails.awayScore?.period2 ?? "0" },
              },
            },
          ],
        },
  } as RugbyUnionMatchPage;
}

export async function rugbyUnionMatchesByDate(date: Date) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("rugby", date)
    : fetchRugbyLeagueMatchesByDate(date));

  if (!matches) return null;

  const validLeagueIds = RUGBY_UNION_LEAGUES.map((l) => Number(l.slug));

  matches.events = matches.events
    .filter((item) =>
      validLeagueIds.includes(item.tournament.uniqueTournament.id),
    )
    .sort(
      (a, b) =>
        validLeagueIds.indexOf(a.tournament.uniqueTournament.id) -
        validLeagueIds.indexOf(b.tournament.uniqueTournament.id),
    );

  if (!matches.events || matches.events.length === 0) return null;

  const fixture = mapFixtureRound(
    API_EVENT_TYPES.SOFASCORE,
    DISPLAY_TYPES.LEAGUE,
    matches.events,
    mapRugbyUnionMatch,
    false,
    undefined,
    SPORT.RUGBY_UNION,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.LEAGUE, fixture),
  } as RugbyUnionTodayPage;
}

function mapRugbyUnionMatch(
  match: Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  let startDate = new Date(0);
  startDate.setUTCSeconds(match.startTimestamp);

  return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, SPORT.RUGBY_UNION, match, {
    startDate: startDate,
    roundLabel: roundLabel,
  });
}
