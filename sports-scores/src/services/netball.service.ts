import {
  fetchNetballLastMatches,
  fetchNetballMatchDetails,
  fetchNetballMatchesByDate,
  fetchNetballNextMatches,
  fetchNetballSeasonMatches,
  fetchNetballStandings,
} from "@/endpoints/netball.api";
import { NETBALL_LEAGUES } from "@/lib/constants";
import {
  getCurrentRound,
  mapFixtureRound,
  mapMatchSummary,
} from "@/lib/eventMapping";
import { shortenTeamNames } from "@/lib/projUtils";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import {
  NetballFixturesPage,
  NetballMatchPage,
  NetballTodayPage,
} from "@/types/netball";
import { SportsDB_Event } from "@/types/sportsdb";

export async function netballMatches(tournamentId: number, seasonId: number) {
  const seasonMatches = await fetchNetballSeasonMatches(tournamentId, seasonId);
  const lastMatches = await fetchNetballLastMatches(tournamentId, seasonId);
  const nextMatches = await fetchNetballNextMatches(tournamentId, seasonId);

  if (!lastMatches && !nextMatches && !seasonMatches) {
    return null;
  }

  const allMatches = (lastMatches?.events ?? [])
    .concat(nextMatches?.events ?? [])
    .concat(seasonMatches?.events ?? []);

  // Remove duplicates based on idEvent
  const matches = Array.from(
    new Map(allMatches.map((match) => [match.idEvent, match])).values(),
  );

  const leagueConfig = NETBALL_LEAGUES.find(
    (l) => Number(l.slug) === tournamentId,
  );

  const fixture = mapFixtureRound(
    API_EVENT_TYPES.SPORTSDB,
    SPORT.NETBALL,
    leagueConfig ?? { name: "", slug: "", seasons: [] },
    matches,
    mapNetballMatch,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(
      leagueConfig?.display ?? DISPLAY_TYPES.ROUND,
      fixture,
    ),
  } as NetballFixturesPage;
}

export async function netballStandings(tournamentId: number, seasonId: number) {
  const standings = await fetchNetballStandings(tournamentId, seasonId);

  if (!standings) {
    return null;
  }

  return null;
  // return {
  //   standings: standings?.standings.map((table) =>
  //     table.rows.map((item) => {
  //       return {
  //         position: item.position,
  //         points: item.points,
  //         team: {
  //           id: item.team.id,
  //           name: shortenTeamNames(item.team.name),
  //           logo: resolveSportImage(item.team.name),
  //         },
  //         games: {
  //           played: item.matches,
  //           win: item.wins,
  //           lost: item.losses,
  //           drawn: item.draws,
  //         },
  //         scores: { against: item.scoresAgainst, for: item.scoresFor },
  //       } as NetballStanding;
  //     }),
  //   ),
  //   qualifyingPosition:
  //     NETBALL_LEAGUES.find((l) => Number(l.slug) === tournamentId)
  //       ?.qualifyingPosition ?? -1,
  // } as NetballLadderPage;
}

export async function netballMatchDetails(matchId: number) {
  const match = await fetchNetballMatchDetails(matchId);
  // const incidents = await fetchNetballMatchIncidents(matchId);

  const matchDetails = match?.events[0];
  // const scoreIncidents = incidents?.incidents
  //   ? incidents?.incidents
  //       .filter((item) => item.incidentType === "goal")
  //       .toReversed()
  //   : null;

  return {
    // scoreEvents: null
    matchDetails: !matchDetails
      ? null
      : {
          status:
            matchDetails.intHomeScore !== null &&
            matchDetails.intAwayScore !== null
              ? "COMPLETED"
              : "UPCOMING",
          homeTeam: {
            name: shortenTeamNames(matchDetails.strHomeTeam),
            score: matchDetails?.intHomeScore?.toString() ?? "0",
            img: matchDetails.strHomeTeamBadge,
          },
          awayTeam: {
            name: shortenTeamNames(matchDetails.strAwayTeam),
            score: matchDetails?.intAwayScore?.toString() ?? "0",
            img: matchDetails.strAwayTeamBadge,
          },
          // scoreBreakdown: [
          //   {
          //     periodName: "1st Half",
          //     teams: {
          //       home: { score: matchDetails.homeScore?.period1 ?? "0" },
          //       away: { score: matchDetails.awayScore?.period1 ?? "0" },
          //     },
          //   },
          //   {
          //     periodName: "2nd Half",
          //     teams: {
          //       home: { score: matchDetails.homeScore?.period2 ?? "0" },
          //       away: { score: matchDetails.awayScore?.period2 ?? "0" },
          //     },
          //   },
          // ],
        },
  } as NetballMatchPage;
}

export async function netballMatchesByDate(date: Date) {
  const matches = await fetchNetballMatchesByDate(date);

  if (!matches || !matches.events) return null;

  const validLeagueIds = NETBALL_LEAGUES.map((l) => Number(l.slug));

  matches.events = matches.events
    // .filter((item) =>
    //   validLeagueIds.includes(item.tournament.uniqueTournament.id),
    // )
    .sort(
      (a, b) =>
        validLeagueIds.indexOf(Number(a.idLeague)) -
        validLeagueIds.indexOf(Number(b.idLeague)),
    );

  if (!matches.events || matches.events.length === 0) return null;

  const fixture = mapFixtureRound(
    API_EVENT_TYPES.SPORTSDB,
    SPORT.NETBALL,
    NETBALL_LEAGUES,
    matches.events,
    mapNetballMatch,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.LEAGUE, fixture),
  } as NetballTodayPage;
}

function mapNetballMatch(
  match: SportsDB_Event,
  roundLabel: string,
): MatchSummary {
  return mapMatchSummary(API_EVENT_TYPES.SPORTSDB, SPORT.NETBALL, match, {});
}
