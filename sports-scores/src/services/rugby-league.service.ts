import { RugbyLeagueStanding } from "@/components/rugby-league/RugbyLeagueLadder";
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
import { RUGBY_LEAGUE_LEAGUES } from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import {
  getCurrentRound,
  mapFixtureRound,
  mapMatchSummary,
  shortenTeamNames,
} from "@/lib/projUtils";
import { getMatchSummariesByTournament } from "@/services/dataverse.service";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import {
  RugbyLeagueFixturesPage,
  RugbyLeagueLadderPage,
  RugbyLeagueMatchPage,
  RugbyLeagueTodayPage,
} from "@/types/rugby-league";
import { Sofascore_Event } from "@/types/sofascore";
import { TZDate } from "@date-fns/tz";
import { isSameDay } from "date-fns";

export async function rugbyLeagueMatches(
  tournamentId: number,
  seasonId: number,
) {
  const [lastMatches, nextMatches, dataverseMatches] = await Promise.all([
    (process.env.DEV_MODE ? fetchLastEvents : fetchRugbyLeagueLastMatches)(
      tournamentId,
      seasonId,
      0,
    ),
    (process.env.DEV_MODE ? fetchNextEvents : fetchRugbyLeagueNextMatches)(
      tournamentId,
      seasonId,
      0,
    ),
    getMatchSummariesByTournament(tournamentId, seasonId, SPORT.RUGBY_LEAGUE),
  ]);

  if (!lastMatches && !nextMatches && !dataverseMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  const leagueConfig = RUGBY_LEAGUE_LEAGUES.find(
    (l) => Number(l.slug) === tournamentId,
  );

  const fixture = mapFixtureRound(
    API_EVENT_TYPES.SOFASCORE,
    SPORT.RUGBY_LEAGUE,
    leagueConfig ?? { name: "", slug: "", seasons: [] },
    matches,
    mapRugbyLeagueMatch,
    dataverseMatches ?? undefined,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(
      leagueConfig?.display ?? DISPLAY_TYPES.ROUND,
      fixture,
    ),
  } as RugbyLeagueFixturesPage;
}

export async function rugbyLeagueStandings(
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
        } as RugbyLeagueStanding;
      }),
    ),
    qualifyingPosition:
      RUGBY_LEAGUE_LEAGUES.find((l) => Number(l.slug) === tournamentId)
        ?.qualifyingPosition ?? -1,
  } as RugbyLeagueLadderPage;
}

export async function rugbyLeagueMatchDetails(matchId: number) {
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
  } as RugbyLeagueMatchPage;
}

export async function rugbyLeagueMatchesByDate(date: Date) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("rugby", date)
    : fetchRugbyLeagueMatchesByDate(date));

  if (!matches) return null;

  const validLeagueIds = RUGBY_LEAGUE_LEAGUES.map((l) => Number(l.slug));
  const timezone = date instanceof TZDate ? date.timeZone : "UTC";

  matches.events = matches.events
    .filter((item) => {
      const eventDate = new TZDate(item.startTimestamp * 1000, timezone);
      return isSameDay(eventDate, date);
    })
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
    SPORT.RUGBY_LEAGUE,
    { name: "", slug: "", seasons: [], display: DISPLAY_TYPES.LEAGUE },
    matches.events,
    mapRugbyLeagueMatch,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.LEAGUE, fixture),
  } as RugbyLeagueTodayPage;
}

function mapRugbyLeagueMatch(
  match: Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  let startDate = new Date(0);
  startDate.setUTCSeconds(match.startTimestamp);

  return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, SPORT.RUGBY_LEAGUE, match, {
    startDate: startDate,
    roundLabel: roundLabel,
  });
}
