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
  RUGBY_LEAGUE_LADDER_HEADINGS,
  RUGBY_LEAGUE_LEAGUES,
} from "@/lib/constants";
import {
  getCurrentRound,
  mapFixtureRounds,
  mapMatchSummary,
} from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import { matchSummariesByTournament } from "@/services/dataverse.service";
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
    matchSummariesByTournament(tournamentId, seasonId, SPORT.RUGBY_LEAGUE),
  ]);

  if (!lastMatches && !nextMatches && !dataverseMatches) {
    return null;
  }

  const apiMatches = (lastMatches?.events ?? [])
    .concat(nextMatches?.events ?? [])
    .map((event) =>
      mapRugbyLeagueMatch(
        event,
        event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
      ),
    );

  // Merge API and dataverse matches, deduplicating by id (API takes priority)
  const apiIds = new Set(apiMatches.map((m) => m.id));
  const allMatches = apiMatches
    .concat((dataverseMatches ?? []).filter((m) => !apiIds.has(m.id)))
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const leagueConfig = RUGBY_LEAGUE_LEAGUES.find(
    (l) => Number(l.slug) === tournamentId,
  );

  const fixture = await mapFixtureRounds(
    leagueConfig ?? { name: "", slug: "", seasons: [] },
    allMatches,
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

  const leagueConfig = RUGBY_LEAGUE_LEAGUES.find(
    (l) => Number(l.slug) === tournamentId,
  );
  const headings = RUGBY_LEAGUE_LADDER_HEADINGS;

  const seasonConfig = leagueConfig?.seasons.find(
    (s) => Number(s.slug) === seasonId,
  );

  return {
    standings: standings?.standings.map((table) => {
      return {
        headings,
        data: table.rows.map((item) => {
          return {
            position: item.position,
            team: {
              id: item.team.id.toString(),
              name: shortenTeamNames(item.team.name),
              logo: resolveSportImage(item.team.name),
            },

            Pts: item.points,
            P: item.matches,
            W: item.wins,
            L: item.losses,
            D: item.draws,
            Diff: item.scoresFor - item.scoresAgainst,
            F: item.scoresFor,
          };
        }),
        placingCategories:
          leagueConfig?.ladderConfig?.[seasonConfig?.ladderConfig ?? 0]
            ?.placingCategories ?? [],
      };
    }),
  } as RugbyLeagueLadderPage<typeof headings>;
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

  const allMatches = matches.events.map((event) =>
    mapRugbyLeagueMatch(
      event,
      event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
    ),
  );

  const fixture = await mapFixtureRounds(RUGBY_LEAGUE_LEAGUES, allMatches);

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.LEAGUE, fixture),
  } as RugbyLeagueTodayPage;
}

function mapRugbyLeagueMatch(
  match: Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, SPORT.RUGBY_LEAGUE, match, {
    roundLabel,
  });
}
