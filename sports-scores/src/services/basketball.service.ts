import {
  BasketballStanding,
  BasketballTeamStanding,
} from "@/components/basketball/BasketballLadder";
import {
  fetchBasketballCurrentMatches,
  fetchBasketballLastMatches,
  fetchBasketballMatchDetails,
  fetchBasketballMatchIncidents,
  fetchBasketballNextMatches,
  fetchBasketballStandings,
} from "@/endpoints/basketball.api";
import { BASKETBALL_LEAGUES } from "@/lib/constants";
import { resolveBasketballTeamImage } from "@/lib/imageMapping";
import {
  setMatchSummary,
  shortenTeamNames,
  toShortTimeString,
} from "@/lib/projUtils";
import {
  BasketballFixturesPage,
  BasketballLadderPage,
  BasketballMatchPage,
  BasketballTodayPage,
} from "@/types/basketball";
import { MatchSummary, RoundDetails, SPORT } from "@/types/misc";

export async function basketballMatches(
  tournamentId: number,
  seasonId: number,
) {
  const lastMatches = await fetchBasketballLastMatches(
    tournamentId,
    seasonId,
    0,
  );

  const nextMatches = await fetchBasketballNextMatches(
    tournamentId,
    seasonId,
    0,
  );

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
              sport: SPORT.BASKETBALL,
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
                img: resolveBasketballTeamImage(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveBasketballTeamImage(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: `Round ${round}`,
        // byes: NRL_TEAM_NAMES.filter((x) => !teams.includes(x)).map((team) => {
        //   return { name: team, img: resolveNRLImages(team) };
        // }),
      } as RoundDetails;
    }),

    currentRound: `Round ${
      nextMatches?.events?.[0]?.roundInfo?.round ??
      lastMatches?.events?.[lastMatches?.events.length - 1]?.roundInfo?.round ??
      0
    }`,
  } as BasketballFixturesPage;
}

export async function basketballStandings(
  tournamentId: number,
  seasonId: number,
) {
  const standings = await fetchBasketballStandings(tournamentId, seasonId);

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
                logo: resolveBasketballTeamImage(standing.team.name),
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
  const match = await fetchBasketballMatchDetails(matchId);
  const incidents = await fetchBasketballMatchIncidents(matchId);

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
          img: resolveBasketballTeamImage(matchDetails.homeTeam.name),
        },
        awayTeam: {
          name: shortenTeamNames(matchDetails?.awayTeam.name),
          score: matchDetails?.awayScore?.current?.toString() ?? "0",
          img: resolveBasketballTeamImage(matchDetails.awayTeam.name),
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

export async function basketballCurrentMatches(
  date: Date,
  // categoryId: number,
) {
  const matches = await fetchBasketballCurrentMatches(date);

  if (!matches) {
    return null;
  }

  const validLeagueIds = BASKETBALL_LEAGUES.map((l) => Number(l.slug));
  const leagueIdToName = Object.fromEntries(
    BASKETBALL_LEAGUES.map((l) => [Number(l.slug), l.name]),
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
              sport: SPORT.BASKETBALL,
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
                img: resolveBasketballTeamImage(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveBasketballTeamImage(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: roundLabel,
      } as RoundDetails;
    }),

    currentRound: leagueIdToName[rounds[0]] ?? "",
  } as BasketballTodayPage;
}
