import {
  fetchMatchDetails,
  fetchMatchIncidents,
  fetchScheduledEvents,
  fetchTournamentLastMatches,
  fetchTournamentNextMatches,
  fetchTournamentStandings,
} from "@/endpoints/sofascore-rapid-api.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import { AFL_TEAM_NAMES, AUSSIE_RULES_LEAGUES } from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import {
  getCurrentRound,
  mapFixtureRound,
  mapMatchSummary,
  shortenTeamNames,
} from "@/lib/projUtils";
import {
  AussieRulesFixturesPage,
  AussieRulesLadderPage,
  AussieRulesMatchPage,
  AussieRulesStanding,
  AussieRulesTodayPage,
} from "@/types/aussie-rules";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import { Sofascore_Event } from "@/types/sofascore";
import { TZDate } from "@date-fns/tz";
import { isSameDay } from "date-fns";

export async function aussieRulesMatches(league: number, season: number) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchLastEvents : fetchTournamentLastMatches
  )(league, season, 0);
  const nextMatches = await (
    process.env.DEV_MODE ? fetchNextEvents : fetchTournamentNextMatches
  )(league, season, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  const displayType =
    AUSSIE_RULES_LEAGUES.find((l) => Number(l.slug) === league)?.display ??
    DISPLAY_TYPES.ROUND;

  const fixture = mapFixtureRound(
    API_EVENT_TYPES.SOFASCORE,
    displayType,
    matches,
    mapAussieRulesMatch,
    league === 656,
    AFL_TEAM_NAMES.map((team) => ({
      name: team,
      img: resolveSportImage(team),
    })),
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(displayType, fixture),
  } as AussieRulesFixturesPage;
}

export async function aussieRulesStandings(league: number, season: number) {
  const standings = await (
    process.env.DEV_MODE ? fetchStandingsTotal : fetchTournamentStandings
  )(league, season);

  if (!standings) {
    return null;
  }

  return {
    standings: standings?.standings[0].rows.map((item) => {
      return {
        position: item.position,
        pts: item.points,
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
      } as AussieRulesStanding;
    }),
    qualifyingPosition:
      AUSSIE_RULES_LEAGUES.find((l) => Number(l.slug) === league)
        ?.qualifyingPosition ?? -1,
  } as AussieRulesLadderPage;
}

export async function aussieRulesMatchDetails(matchId: number) {
  const match = await (
    process.env.DEV_MODE ? fetchEventDetails : fetchMatchDetails
  )(matchId);
  const incidents = await (
    process.env.DEV_MODE ? fetchEventIncidents : fetchMatchIncidents
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
          scoreBreakdown: [1, 2, 3, 4].map((quarter) => ({
            quarter,
            teams: {
              home: {
                id: matchDetails.homeTeam.id,
                goals: undefined,
                behinds: undefined,
                points:
                  (matchDetails.homeScore as Record<string, any>)[
                    `period${quarter}`
                  ] ?? "0",
              },
              away: {
                id: matchDetails.awayTeam.id,
                goals: undefined,
                behinds: undefined,
                points:
                  (matchDetails.awayScore as Record<string, any>)[
                    `period${quarter}`
                  ] ?? "0",
              },
            },
          })),
        },
  } as AussieRulesMatchPage;
}

export async function aussieRulesCurrentMatches(date: Date) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("aussie-rules", date)
    : fetchScheduledEvents(87));

  if (!matches) {
    return null;
  }

  const validLeagueIds = AUSSIE_RULES_LEAGUES.map((l) => Number(l.slug));

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
    DISPLAY_TYPES.LEAGUE,
    matches.events,
    mapAussieRulesMatch,
    false,
    undefined,
    SPORT.AUSSIE_RULES,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.LEAGUE, fixture),
  } as AussieRulesTodayPage;
}

function mapAussieRulesMatch(
  match: Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  let startDate = new Date(0);
  startDate.setUTCSeconds(match.startTimestamp);

  return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, SPORT.AUSSIE_RULES, match, {
    startDate: startDate,
    roundLabel: roundLabel,
  });
}
