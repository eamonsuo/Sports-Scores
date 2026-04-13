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
  RUGBY_UNION_LADDER_HEADINGS,
  RUGBY_UNION_LEAGUES,
} from "@/lib/constants";
import {
  getCurrentRound,
  mapFixtureRounds,
  mapMatchSummary,
} from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
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
import { TZDate } from "@date-fns/tz";
import { isSameDay } from "date-fns";

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

  const allMatches = (lastMatches?.events ?? [])
    .concat(nextMatches?.events ?? [])
    .map((event) =>
      mapRugbyUnionMatch(
        event,
        event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
      ),
    )
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const leagueConfig = RUGBY_UNION_LEAGUES.find(
    (l) => Number(l.slug) === tournamentId,
  );

  const fixture = await mapFixtureRounds(allMatches, leagueConfig);

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(fixture, leagueConfig?.display),
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

  const leagueConfig = RUGBY_UNION_LEAGUES.find(
    (l) => Number(l.slug) === tournamentId,
  );
  const headings = RUGBY_UNION_LADDER_HEADINGS;

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
              id: item.team.id,
              name: shortenTeamNames(item.team.name),
              logo: resolveSportImage(item.team.name),
            },
            P: item.matches,
            W: item.wins,
            L: item.losses,
            Diff: item.scoresFor - item.scoresAgainst,
            BP: (item.points ?? 0) - item.wins * 4 - (item.draws ?? 0) * 2,
            Pts: item.points,
          };
        }),
        placingCategories:
          leagueConfig?.ladderConfig?.[seasonConfig?.ladderConfig ?? 0]
            ?.placingCategories ?? [],
      };
    }),
  } as RugbyUnionLadderPage<typeof headings>;
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
    mapRugbyUnionMatch(
      event,
      event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
    ),
  );

  const fixture = await mapFixtureRounds(allMatches, RUGBY_UNION_LEAGUES);

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(fixture, DISPLAY_TYPES.LEAGUE),
  } as RugbyUnionTodayPage;
}

function mapRugbyUnionMatch(
  match: Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, SPORT.RUGBY_UNION, match, {
    roundLabel,
  });
}
