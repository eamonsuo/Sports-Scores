import { IceHockeyStanding } from "@/components/ice-hockey/IceHockeyLadder";
import {
  fetchIceHockeyLastMatches,
  fetchIceHockeyMatchDetails,
  fetchIceHockeyMatchesByDate,
  fetchIceHockeyMatchIncidents,
  fetchIceHockeyNextMatches,
  fetchIceHockeyStandings,
} from "@/endpoints/ice-hockey.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import { ICE_HOCKEY_LEAGUES } from "@/lib/constants";
import {
  getCurrentRound,
  mapFixtureRound,
  mapMatchSummary,
} from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import {
  IceHockeyFixturesPage,
  IceHockeyLadderPage,
  IceHockeyMatchPage,
  IceHockeyTodayPage,
} from "@/types/ice-hockey";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import { Sofascore_Event } from "@/types/sofascore";
import { TZDate } from "@date-fns/tz";
import { isSameDay } from "date-fns";

export async function iceHockeyMatches(tournamentId: number, seasonId: number) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchLastEvents : fetchIceHockeyLastMatches
  )(tournamentId, seasonId, 0);
  const nextMatches = await (
    process.env.DEV_MODE ? fetchNextEvents : fetchIceHockeyNextMatches
  )(tournamentId, seasonId, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  const leagueConfig = ICE_HOCKEY_LEAGUES.find(
    (l) => Number(l.slug) === tournamentId,
  );

  const fixture = mapFixtureRound(
    API_EVENT_TYPES.SOFASCORE,
    SPORT.ICE_HOCKEY,
    leagueConfig ?? { name: "", slug: "", seasons: [] },
    matches,
    mapIceHockeyMatch,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(
      leagueConfig?.display ?? DISPLAY_TYPES.ROUND,
      fixture,
    ),
  } as IceHockeyFixturesPage;
}

export async function iceHockeyStandings(
  tournamentId: number,
  seasonId: number,
) {
  const standings = await (
    process.env.DEV_MODE ? fetchStandingsTotal : fetchIceHockeyStandings
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
        } as IceHockeyStanding;
      }),
    ),
    qualifyingPosition:
      ICE_HOCKEY_LEAGUES.find((l) => Number(l.slug) === tournamentId)
        ?.qualifyingPosition ?? -1,
  } as IceHockeyLadderPage;
}

export async function iceHockeyMatchDetails(matchId: number) {
  const match = await (
    process.env.DEV_MODE ? fetchEventDetails : fetchIceHockeyMatchDetails
  )(matchId);
  const incidents = await (
    process.env.DEV_MODE ? fetchEventIncidents : fetchIceHockeyMatchIncidents
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
              periodName: "1st Period",
              teams: {
                home: { score: matchDetails.homeScore?.period1 ?? "0" },
                away: { score: matchDetails.awayScore?.period1 ?? "0" },
              },
            },
            {
              periodName: "2nd Period",
              teams: {
                home: { score: matchDetails.homeScore?.period2 ?? "0" },
                away: { score: matchDetails.awayScore?.period2 ?? "0" },
              },
            },
            {
              periodName: "3rd Period",
              teams: {
                home: { score: matchDetails.homeScore?.period3 ?? "0" },
                away: { score: matchDetails.awayScore?.period3 ?? "0" },
              },
            },
          ],
        },
  } as IceHockeyMatchPage;
}

export async function iceHockeyMatchesByDate(date: Date) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("ice-hockey", date)
    : fetchIceHockeyMatchesByDate(date));

  if (!matches) return null;

  const validLeagueIds = ICE_HOCKEY_LEAGUES.map((l) => Number(l.slug));
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
    SPORT.ICE_HOCKEY,
    ICE_HOCKEY_LEAGUES,
    matches.events,
    mapIceHockeyMatch,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.LEAGUE, fixture),
  } as IceHockeyTodayPage;
}

function mapIceHockeyMatch(
  match: Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, SPORT.ICE_HOCKEY, match, {
    roundLabel,
  });
}
