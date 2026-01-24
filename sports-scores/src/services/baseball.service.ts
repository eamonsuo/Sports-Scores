import {
  BaseballStanding,
  BaseballTeamStanding,
} from "@/components/baseball/BaseballLadder";
import { BaseballScoreBreakdown } from "@/components/baseball/BaseballScoreBreakdown";
import {
  fetchBaseballCurrentMatches,
  fetchBaseballLastMatches,
  fetchBaseballMatchDetails,
  fetchBaseballNextMatches,
  fetchBaseballStandings,
} from "@/endpoints/baseball.api";
import { BASEBALL_LEAGUES } from "@/lib/constants";
import { resolveBaseballTeamImage } from "@/lib/imageMapping";
import {
  setMatchSummary,
  shortenTeamNames,
  toShortTimeString,
} from "@/lib/projUtils";
import {
  BaseballFixturesPage,
  BaseballLadderPage,
  BaseballMatchPage,
  BaseballTodayPage,
} from "@/types/baseball";
import { MatchSummary, RoundDetails, SPORT } from "@/types/misc";

export async function baseballMatches(tournamentId: number, seasonId: number) {
  const lastMatches = await fetchBaseballLastMatches(tournamentId, seasonId, 0);

  const nextMatches = await fetchBaseballNextMatches(tournamentId, seasonId, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  for (let i = 1; i < matches.length; i++) {
    if (matches[i].roundInfo === undefined) {
      matches[i].roundInfo = { round: 0 };
    }
  }

  const rounds = [...new Set(matches.map((item) => item.roundInfo?.round))];

  return {
    fixtures: rounds.map((round) => {
      //Get all teams playing in the round
      let teams = matches
        .filter((item) => item.roundInfo?.round === round)
        .flatMap((game) => [game.homeTeam.name, game.awayTeam.name]);

      return {
        matches: matches
          .filter((item) => item.roundInfo?.round === round)
          .map((match) => {
            var startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);

            return {
              startDate: startDate,
              roundLabel: `Round ${match.roundInfo?.round}`,
              timer:
                match.status.type === "notstarted"
                  ? toShortTimeString(startDate)
                  : match.status.description,
              timerDisplayColour:
                match.status.type === "inprogress" ? "green" : null,
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.BASEBALL,
              status: match.status.description,
              venue: "",
              summaryText: setMatchSummary(
                match.status.type,
                toShortTimeString(startDate),
                match.homeTeam.name,
                match.homeScore.current,
                match.awayTeam.name,
                match.awayScore.current,
              ),
              homeDetails: {
                name: shortenTeamNames(match.homeTeam.name),
                score: match.homeScore.current?.toString() ?? "0",
                img: resolveBaseballTeamImage(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveBaseballTeamImage(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: `Round ${round}`,
      } as RoundDetails;
    }),

    currentRound: `Round ${
      nextMatches?.events?.[0]?.roundInfo?.round ??
      lastMatches?.events?.[lastMatches?.events.length - 1]?.roundInfo?.round ??
      0
    }`,
  } as BaseballFixturesPage;
}

export async function baseballStandings(
  tournamentId: number,
  seasonId: number,
) {
  const standings = await fetchBaseballStandings(tournamentId, seasonId);

  if (!standings) {
    return null;
  }

  return {
    tables: standings?.standings
      .sort((a, b) => {
        const orderA = tableOrder(a.name);
        const orderB = tableOrder(b.name);
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name); // Alphabetical within group
      })
      .map((table) => {
        return {
          tableName: table.name,
          standings: table.rows.map((standing) => {
            return {
              position: standing.position,
              played: standing.wins + standing.losses,
              won: standing.wins,
              lost: standing.losses,
              pct: standing.percentage,
              team: {
                id: standing.team.id,
                name: shortenTeamNames(standing.team.name),
                logo: resolveBaseballTeamImage(standing.team.name),
              },
            } as BaseballTeamStanding;
          }),
        } as BaseballStanding;
      }),
  } as BaseballLadderPage;
}

export async function baseballMatchDetails(matchId: number) {
  const match = await fetchBaseballMatchDetails(matchId);

  const matchDetails = match?.event;

  let scoreDetails = !matchDetails
    ? null
    : {
        status: matchDetails?.status.description,
        homeTeam: {
          name: shortenTeamNames(matchDetails.homeTeam.name),
          score: matchDetails?.homeScore?.current?.toString() ?? "0",
          img: resolveBaseballTeamImage(matchDetails.homeTeam.name),
        },
        awayTeam: {
          name: shortenTeamNames(matchDetails?.awayTeam.name),
          score: matchDetails?.awayScore?.current?.toString() ?? "0",
          img: resolveBaseballTeamImage(matchDetails.awayTeam.name),
        },

        scoreBreakdown: [
          {
            inning: "1",
            teams: {
              home: { score: matchDetails.homeScore?.period1 ?? "0" },
              away: { score: matchDetails.awayScore?.period1 ?? "0" },
            },
          },
          {
            inning: "2",
            teams: {
              home: { score: matchDetails.homeScore?.period2 ?? "0" },
              away: { score: matchDetails.awayScore?.period2 ?? "0" },
            },
          },
          {
            inning: "3",
            teams: {
              home: { score: matchDetails.homeScore?.period3 ?? "0" },
              away: { score: matchDetails.awayScore?.period3 ?? "0" },
            },
          },
          {
            inning: "4",
            teams: {
              home: { score: matchDetails.homeScore?.period4 ?? "0" },
              away: { score: matchDetails.awayScore?.period4 ?? "0" },
            },
          },
          {
            inning: "5",
            teams: {
              home: { score: matchDetails.homeScore?.period5 ?? "0" },
              away: { score: matchDetails.awayScore?.period5 ?? "0" },
            },
          },
          {
            inning: "6",
            teams: {
              home: { score: matchDetails.homeScore?.period6 ?? "0" },
              away: { score: matchDetails.awayScore?.period6 ?? "0" },
            },
          },
          {
            inning: "7",
            teams: {
              home: { score: matchDetails.homeScore?.period7 ?? "0" },
              away: { score: matchDetails.awayScore?.period7 ?? "0" },
            },
          },
          {
            inning: "8",
            teams: {
              home: { score: matchDetails.homeScore?.period8 ?? "0" },
              away: { score: matchDetails.awayScore?.period8 ?? "0" },
            },
          },
          {
            inning: "9",
            teams: {
              home: { score: matchDetails.homeScore?.period9 ?? "0" },
              away: { score: matchDetails.awayScore?.period9 ?? "0" },
            },
          },
        ] as BaseballScoreBreakdown[],
      };

  if (scoreDetails && matchDetails?.status.description === "AET") {
    scoreDetails.scoreBreakdown.push({
      inning: "Extra",
      teams: {
        home: {
          score:
            matchDetails.homeScore?.current -
            matchDetails.homeScore?.normaltime,
        },
        away: {
          score:
            matchDetails.awayScore?.current -
            matchDetails.awayScore?.normaltime,
        },
      },
    });
  }

  return {
    matchDetails: scoreDetails,
  } as BaseballMatchPage;
}

export async function baseballCurrentMatches(
  date: Date,
  // categoryId: number,
) {
  const matches = await fetchBaseballCurrentMatches(date);

  if (!matches) {
    return null;
  }

  const validLeagueIds = BASEBALL_LEAGUES.map((l) => Number(l.slug));
  const leagueIdToName = Object.fromEntries(
    BASEBALL_LEAGUES.map((l) => [Number(l.slug), l.name]),
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

  // Get unique league ids in order
  const rounds = [
    ...new Set(
      matches.events.map((item) => item.tournament.uniqueTournament.id),
    ),
  ];

  return {
    fixtures: rounds.map((leagueId) => {
      const roundLabel = leagueIdToName[leagueId] ?? "";
      return {
        matches: matches.events
          .filter((item) => item.tournament.uniqueTournament.id === leagueId)
          .map((match) => {
            var startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);

            return {
              startDate: startDate,
              roundLabel: roundLabel,
              timer:
                match.status.type === "notstarted"
                  ? toShortTimeString(startDate)
                  : match.status.description,
              timerDisplayColour:
                match.status.type === "inprogress" ? "green" : null,
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.BASEBALL,
              status: match.status.description,
              venue: "",
              summaryText: setMatchSummary(
                match.status.type,
                toShortTimeString(startDate),
                match.homeTeam.name,
                match.homeScore.current,
                match.awayTeam.name,
                match.awayScore.current,
              ),
              homeDetails: {
                name: shortenTeamNames(match.homeTeam.name),
                score: match.homeScore.current?.toString() ?? "0",
                img: resolveBaseballTeamImage(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveBaseballTeamImage(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: roundLabel,
      } as RoundDetails;
    }),

    currentRound: leagueIdToName[rounds[0]] ?? "",
  } as BaseballTodayPage;
}

// Custom sort: division < conference < MLB
function tableOrder(name: string): number {
  if (name === "MLB") return 2;
  if (name.split(" ").length == 2) return 1;
  return 0; // Division tables
}
