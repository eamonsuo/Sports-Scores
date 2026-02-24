import { RugbyLeagueStanding } from "@/components/rugby-league/NRLLadder";
import {
  fetchRugbyLeagueMatchDetails,
  fetchRugbyLeagueMatchesByDate,
  fetchRugbyLeagueMatchIncidents,
  fetchRugbyLeagueStandings,
} from "@/endpoints/rugby-league.api";
import { fetchLastEvents, fetchNextEvents } from "@/endpoints/sofascore.api";
import { NRL_TEAMS_NAME_LOGO, RUGBY_LEAGUE_LEAGUES } from "@/lib/constants";
import { resolveNRLImages } from "@/lib/imageMapping";
import {
  getCurrentRound,
  mapFixtureRound,
  mapMatchSummary,
  shortenTeamNames,
} from "@/lib/projUtils";
import {
  API_EVENT_TYPES,
  FixtureRound,
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

export async function rugbyLeagueMatches(
  tournamentId: number,
  seasonId: number,
) {
  const lastMatches = await fetchNextEvents(tournamentId, seasonId, 0);
  const nextMatches = await fetchLastEvents(tournamentId, seasonId, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  const fixture = mapFixtureRound(
    API_EVENT_TYPES.SOFASCORE,
    "",
    matches,
    mapRugbyLeagueMatch,
    tournamentId === 294,
    NRL_TEAMS_NAME_LOGO,
  );
  return {
    fixtures: fixture,
    currentRound: getCurrentRound(fixture),
  } as RugbyLeagueFixturesPage;
}

export async function rugbyLeagueStandings(
  tournamentId: number,
  seasonId: number,
) {
  const standings = await fetchRugbyLeagueStandings(tournamentId, seasonId);

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
            logo: resolveNRLImages(item.team.name),
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
  const match = await fetchRugbyLeagueMatchDetails(matchId);
  const incidents = await fetchRugbyLeagueMatchIncidents(matchId);

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
            img: resolveNRLImages(matchDetails.homeTeam.name),
          },
          awayTeam: {
            name: shortenTeamNames(matchDetails?.awayTeam.name),
            score: matchDetails?.awayScore?.current?.toString() ?? "0",
            img: resolveNRLImages(matchDetails.awayTeam.name),
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
  const matches = await fetchRugbyLeagueMatchesByDate(date);

  if (!matches) return null;

  const validLeagueIds = RUGBY_LEAGUE_LEAGUES.map((l) => Number(l.slug));
  const leagueIdToName = Object.fromEntries(
    RUGBY_LEAGUE_LEAGUES.map((l) => [
      Number(l.slug),
      { name: l.name, currentSeason: l.seasons[0].slug },
    ]),
  );

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

  // Get unique league ids in order
  const rounds = [
    ...new Set(
      matches.events.map((item) => item.tournament.uniqueTournament.id),
    ),
  ];

  let currentRound = "";

  return {
    fixtures:
      // mapFixtureRound("type",
      //   API_EVENT_TYPES.SOFASCORE,
      //   matches.events, mapRugbyLeagueMatch, false)

      rounds.map((leagueId) => {
        const roundLabel = leagueIdToName[leagueId]?.name ?? "";
        currentRound = currentRound === "" ? roundLabel : currentRound;
        return {
          matches: matches.events
            .filter((item) => item.tournament.uniqueTournament.id === leagueId)
            .map((match) => mapRugbyLeagueMatch(match, roundLabel)),
          roundLabel: roundLabel,
          roundSlug: `${leagueId}/${leagueIdToName[leagueId]?.currentSeason}`,
          sport: SPORT.RUGBY_LEAGUE,
        } as FixtureRound;
      }),

    currentRound: currentRound,
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
    homeDetails: {
      img: resolveNRLImages(match.homeTeam.name),
    },
    awayDetails: {
      img: resolveNRLImages(match.awayTeam.name),
    },
  });
}
