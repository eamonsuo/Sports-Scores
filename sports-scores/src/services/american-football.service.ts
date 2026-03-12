import {
  AmericanFootballStanding,
  AmericanFootballTeamStanding,
} from "@/components/american-football/AmericanFootballLadder";
import {
  fetchAmericanFootballLastMatches,
  fetchAmericanFootballMatchDetails,
  fetchAmericanFootballCurrentMatches as fetchAmericanFootballMatchesByDate,
  fetchAmericanFootballMatchIncidents,
  fetchAmericanFootballNextMatches,
  fetchAmericanFootballStandings,
} from "@/endpoints/american-football.api";
import {
  fetchEventDetails,
  fetchEventIncidents,
  fetchEventsByDate,
  fetchLastEvents,
  fetchNextEvents,
  fetchStandingsTotal,
} from "@/endpoints/sofascore.api";
import { AMERICAN_FOOTBALL_LEAGUES, NFL_TEAM_NAMES } from "@/lib/constants";
import { resolveSportImage } from "@/lib/imageMapping";
import {
  getCurrentRound,
  mapFixtureRound,
  mapMatchSummary,
  shortenTeamNames,
} from "@/lib/projUtils";
import {
  AmericanFootball_AmericanFootballApi_CategorySchedule_Response,
  AmericanFootball_Sofascore_Event,
  AmericanFootballFixturesPage,
  AmericanFootballLadderPage,
  AmericanFootballMatchPage,
} from "@/types/american-football";
import {
  API_EVENT_TYPES,
  DISPLAY_TYPES,
  MatchSummary,
  SPORT,
} from "@/types/misc";
import { TZDate } from "@date-fns/tz";
import { isSameDay } from "date-fns";

export async function americanFootballMatches(league: number, season: number) {
  const lastMatches = await (
    process.env.DEV_MODE ? fetchLastEvents : fetchAmericanFootballLastMatches
  )(league, season, 0);
  const nextMatches = await (
    process.env.DEV_MODE ? fetchNextEvents : fetchAmericanFootballNextMatches
  )(league, season, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(
    nextMatches?.events ?? [],
  ) as AmericanFootball_Sofascore_Event[];

  const displayType =
    AMERICAN_FOOTBALL_LEAGUES.find((l) => Number(l.slug) === league)?.display ??
    DISPLAY_TYPES.ROUND;

  const fixture = mapFixtureRound(
    API_EVENT_TYPES.SOFASCORE,
    displayType,
    matches,
    mapAmericanFootballMatch,
    league === 9464,
    NFL_TEAM_NAMES.map((team) => ({
      name: team,
      img: resolveSportImage(team),
    })),
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(displayType, fixture),
  } as AmericanFootballFixturesPage;
}

export async function americanFootballStandings(
  league: number,
  season: number,
) {
  const standings = await (
    process.env.DEV_MODE ? fetchStandingsTotal : fetchAmericanFootballStandings
  )(league, season);
  if (!standings) {
    return null;
  }

  return {
    tables: standings?.standings
      .sort((a, b) => b.name.localeCompare(a.name))
      .map((table) => {
        return {
          tableName: table.name,
          standings: table.rows.map((standing) => {
            return {
              position: standing.position,
              played: standing.matches,
              won: standing.wins,
              lost: standing.losses,
              ties: standing.draws,
              team: {
                id: standing.team.id,
                name: shortenTeamNames(standing.team.name),
                logo: resolveSportImage(standing.team.name),
              },
              points: {
                for: standing.scoresFor,
                against: standing.scoresAgainst,
              },
            } as AmericanFootballTeamStanding;
          }),
        } as AmericanFootballStanding;
      }),
  } as AmericanFootballLadderPage;
}

export async function americanFootballMatchDetails(matchId: number) {
  const match = await (
    process.env.DEV_MODE ? fetchEventDetails : fetchAmericanFootballMatchDetails
  )(matchId);
  const incidents = await (
    process.env.DEV_MODE
      ? fetchEventIncidents
      : fetchAmericanFootballMatchIncidents
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
  } as AmericanFootballMatchPage;
}

export async function americanFootballMatchesByDate(date: Date) {
  const matches = (await (process.env.DEV_MODE
    ? fetchEventsByDate("american-football", date)
    : fetchAmericanFootballMatchesByDate(
        date,
      ))) as AmericanFootball_AmericanFootballApi_CategorySchedule_Response;

  if (!matches || matches.events.length === 0) {
    return null;
  }

  const validLeagueIds = AMERICAN_FOOTBALL_LEAGUES.map((l) => Number(l.slug));

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
    mapAmericanFootballMatch,
    false,
    undefined,
    SPORT.AMERICAN_FOOTBALL,
  );

  return {
    fixtures: fixture,
    currentRound: getCurrentRound(DISPLAY_TYPES.LEAGUE, fixture),
  } as AmericanFootballFixturesPage;
}

function mapAmericanFootballMatch(
  match: AmericanFootball_Sofascore_Event,
  roundLabel: string,
): MatchSummary {
  let startDate = new Date(0);
  startDate.setUTCSeconds(match.startTimestamp);

  const summary = mapMatchSummary(
    API_EVENT_TYPES.SOFASCORE,
    SPORT.AMERICAN_FOOTBALL,
    match,
    {
      startDate: startDate,
      roundLabel: roundLabel,
    },
  );

  summary.homeDetails.winDrawLoss = match.homeTeamSeasonHistoricalForm
    ? `${match.homeTeamSeasonHistoricalForm.wins ?? 0}-${match.homeTeamSeasonHistoricalForm.losses ?? 0}${match.homeTeamSeasonHistoricalForm.draws ? "-" + match.homeTeamSeasonHistoricalForm.draws : ""}`
    : undefined;
  summary.awayDetails.winDrawLoss = match.awayTeamSeasonHistoricalForm
    ? `${match.awayTeamSeasonHistoricalForm.wins ?? 0}-${match.awayTeamSeasonHistoricalForm.losses ?? 0}${match.awayTeamSeasonHistoricalForm.draws ? "-" + match.awayTeamSeasonHistoricalForm.draws : ""}`
    : undefined;

  return summary;
}
