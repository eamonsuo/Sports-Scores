import {
  BasketballStanding,
  BasketballTeamStanding,
} from "@/components/basketball/BasketballLadder";
import {
  fetchBasketballLastMatches,
  fetchBasketballMatchDetails,
  fetchBasketballMatchesByDate,
  fetchBasketballMatchIncidents,
  fetchBasketballNextMatches,
  fetchBasketballStandings,
} from "@/endpoints/basketball.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import { BASKETBALL_LEAGUES } from "@/lib/constants";
import {
  getCurrentRound,
  mapFixtureRounds,
  mapMatchSummary,
} from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import {
  BasketballFixturesPage,
  BasketballLadderPage,
  BasketballMatchPage,
  BasketballTodayPage,
} from "@/types/basketball";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import { Sofascore_Event } from "@/types/sofascore";
import { TZDate } from "@date-fns/tz";
import { isSameDay } from "date-fns";

export async function basketballMatches(
  tournamentId: number,
  seasonId: number,
) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchLastEvents : fetchBasketballLastMatches
  )(tournamentId, seasonId, 0);

  const nextMatches = await (
    process.env.DEV_MODE ? fetchNextEvents : fetchBasketballNextMatches
  )(tournamentId, seasonId, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const allMatches = (lastMatches?.events ?? [])
    .concat(nextMatches?.events ?? [])
    .map((event) =>
      mapBasketballMatch(
        event,
        event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
      ),
    )
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const leagueConfig = BASKETBALL_LEAGUES.find(
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
  } as BasketballFixturesPage;
}

export async function basketballStandings(
  tournamentId: number,
  seasonId: number,
) {
  const standings = await (
    process.env.DEV_MODE ? fetchStandingsTotal : fetchBasketballStandings
  )(tournamentId, seasonId);

  if (!standings) {
    return null;
  }

  return {
    standings: standings?.standings
      // .sort((a, b) => b.name.localeCompare(a.name))
      .map((table) => {
        return {
          tableName: table.name,
          standings: table.rows.map((standing) => {
            return {
              position: standing.position,
              played: standing.matches,
              won: standing.wins,
              lost: standing.losses,
              // ties: standing.draws,
              team: {
                id: standing.team.id,
                name: shortenTeamNames(standing.team.name),
                logo: resolveSportImage(standing.team.name),
              },
              points: {
                for: standing.scoresFor,
                against: standing.scoresAgainst,
              },
              pct: standing.percentage,
            } as BasketballTeamStanding;
          }),
        } as BasketballStanding;
      }),

    qualifyingPosition:
      BASKETBALL_LEAGUES.find((l) => Number(l.slug) === tournamentId)
        ?.qualifyingPosition ?? -1,
  } as BasketballLadderPage;
}

export async function basketballMatchDetails(matchId: number) {
  const match = await (
    process.env.DEV_MODE ? fetchEventDetails : fetchBasketballMatchDetails
  )(matchId);
  const incidents = await (
    process.env.DEV_MODE ? fetchEventIncidents : fetchBasketballMatchIncidents
  )(matchId);

  const matchDetails = match?.event;
  const scoreIncidents = incidents?.incidents
    ? incidents?.incidents
        .filter((item) => item.incidentType === "goal")
        .toReversed()
    : null;

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
            periodName: "Q1",
            teams: {
              home: { score: matchDetails.homeScore?.period1 ?? "0" },
              away: { score: matchDetails.awayScore?.period1 ?? "0" },
            },
          },
          {
            periodName: "Q2",
            teams: {
              home: { score: matchDetails.homeScore?.period2 ?? "0" },
              away: { score: matchDetails.awayScore?.period2 ?? "0" },
            },
          },
          {
            periodName: "Q3",
            teams: {
              home: { score: matchDetails.homeScore?.period3 ?? "0" },
              away: { score: matchDetails.awayScore?.period3 ?? "0" },
            },
          },
          {
            periodName: "Q4",
            teams: {
              home: { score: matchDetails.homeScore?.period4 ?? "0" },
              away: { score: matchDetails.awayScore?.period4 ?? "0" },
            },
          },
        ],
      };

  if (scoreDetails && matchDetails?.homeScore.overtime) {
    scoreDetails.scoreBreakdown.push({
      periodName: "OT",
      teams: {
        home: { score: matchDetails.homeScore?.overtime ?? "0" },
        away: { score: matchDetails.awayScore?.overtime ?? "0" },
      },
    });
  }

  return {
    scoreEvents: !scoreIncidents
      ? null
      : scoreIncidents.map((item) => {
          return {
            event: item.incidentClass,
            difference: (item.homeScore ?? 0) - (item.awayScore ?? 0),
          };
        }),
    matchDetails: scoreDetails,
  } as BasketballMatchPage;
}

export async function basketballMatchesByDate(
  date: Date,
  // categoryId: number,
) {
  const matches = await (process.env.DEV_MODE
    ? fetchEventsByDate("basketball", date)
    : fetchBasketballMatchesByDate(date));

  if (!matches) {
    return null;
  }

  const validLeagueIds = BASKETBALL_LEAGUES.map((l) => Number(l.slug));

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
    mapBasketballMatch(
      event,
      event.roundInfo?.name ?? `Round ${event.roundInfo?.round}`,
    ),
  );

  const fixture = mapFixtureRounds(BASKETBALL_LEAGUES, allMatches);

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.LEAGUE, fixture),
  } as BasketballTodayPage;
}

function mapBasketballMatch(
  match: Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  return mapMatchSummary(API_EVENT_TYPES.SOFASCORE, SPORT.BASKETBALL, match, {
    roundLabel,
  });
}
