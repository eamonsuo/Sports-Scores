import {
  AmericanFootballStanding,
  AmericanFootballTeamStanding,
} from "@/components/american-football/AmericanFootballLadder";
import {
  fetchAmericanFootballCurrentMatches,
  fetchAmericanFootballLastMatches,
  fetchAmericanFootballMatchDetails,
  fetchAmericanFootballMatchIncidents,
  fetchAmericanFootballNextMatches,
  fetchAmericanFootballStandings,
} from "@/endpoints/american-football.api";
import { AMERICAN_FOOTBALL_LEAGUES, NFL_TEAM_NAMES } from "@/lib/constants";
import { resolveNFLImages } from "@/lib/imageMapping";
import {
  setMatchSummary,
  shortenTeamNames,
  toShortTimeString,
} from "@/lib/projUtils";
import {
  AmericanFootballFixturesPage,
  AmericanFootballLadderPage,
  AmericanFootballMatchPage,
} from "@/types/american-football";
import { MatchSummary, RoundDetails, SPORT } from "@/types/misc";

export async function americanFootballMatches(league: number, season: number) {
  const lastMatches = await fetchAmericanFootballLastMatches(league, season, 0);
  const nextMatches = await fetchAmericanFootballNextMatches(league, season, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);

  for (let i = 1; i < matches.length; i++) {
    if (matches[i].roundInfo === undefined) {
      matches[i].roundInfo = { round: 0 };
    }
  }

  const rounds = [
    ...new Set(
      matches.map((item) => item.roundInfo?.name ?? item.roundInfo?.round),
    ),
  ];

  return {
    fixtures: rounds.map((round) => {
      //Get all teams playing in the round
      let teams = matches
        .filter(
          (item) =>
            item.roundInfo?.round === round || item.roundInfo?.name === round,
        )
        .flatMap((game) => [game.homeTeam.name, game.awayTeam.name]);

      return {
        matches: matches
          .filter(
            (item) =>
              item.roundInfo?.round === round || item.roundInfo?.name === round,
          )
          .map((match) => {
            var startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);

            return {
              startDate: startDate,
              roundLabel:
                match.roundInfo?.name ?? `Week ${match.roundInfo?.round}`,
              timer:
                match.status.type === "notstarted"
                  ? toShortTimeString(startDate)
                  : match.status.description,
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.AMERICAN_FOOTBALL,
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
                img: resolveNFLImages(match.homeTeam.name),
                winDrawLoss: match.homeTeamSeasonHistoricalForm
                  ? `${match.homeTeamSeasonHistoricalForm.wins ?? 0}-${match.homeTeamSeasonHistoricalForm.losses ?? 0}${match.homeTeamSeasonHistoricalForm.draws ? "-" + match.homeTeamSeasonHistoricalForm.draws : ""}`
                  : null,
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveNFLImages(match.awayTeam.name),
                winDrawLoss: match.awayTeamSeasonHistoricalForm
                  ? `${match.awayTeamSeasonHistoricalForm.wins ?? 0}-${match.awayTeamSeasonHistoricalForm.losses ?? 0}${match.awayTeamSeasonHistoricalForm.draws ? "-" + match.awayTeamSeasonHistoricalForm.draws : ""}`
                  : null,
              },
            } as MatchSummary;
          }),
        roundLabel: typeof round === "string" ? round : `Week ${round}`,
        byes:
          typeof round !== "string"
            ? NFL_TEAM_NAMES.filter((x) => !teams.includes(x)).map((team) => {
                return {
                  name: team,
                  img: resolveNFLImages(team),
                };
              })
            : [],
      } as RoundDetails;
    }),

    currentRound:
      (nextMatches?.events[0]?.roundInfo?.name ??
      nextMatches?.events[0]?.roundInfo?.round !== undefined)
        ? `Week ${
            nextMatches?.events[0]?.roundInfo?.round ??
            lastMatches?.events[lastMatches?.events.length - 1]?.roundInfo
              ?.round ??
            0
          }`
        : lastMatches?.events[lastMatches?.events.length - 1]?.roundInfo?.name,
  } as AmericanFootballFixturesPage;
}

export async function americanFootballStandings(
  league: number,
  season: number,
) {
  const standings = await fetchAmericanFootballStandings(league, season);
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
                logo: resolveNFLImages(standing.team.name),
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
  const match = await fetchAmericanFootballMatchDetails(matchId);
  const incidents = await fetchAmericanFootballMatchIncidents(matchId);

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
          img: resolveNFLImages(matchDetails.homeTeam.name),
        },
        awayTeam: {
          name: shortenTeamNames(matchDetails?.awayTeam.name),
          score: matchDetails?.awayScore?.current?.toString() ?? "0",
          img: resolveNFLImages(matchDetails.awayTeam.name),
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

export async function americanFootballCurrentMatches(
  date: "TODAY" | "YESTERDAY" | "TOMORROW",
) {
  const matches = await fetchAmericanFootballCurrentMatches(date, 1370);

  if (!matches) {
    return null;
  }

  const validLeagueIds = AMERICAN_FOOTBALL_LEAGUES.map((l) => Number(l.slug));
  const leagueIdToName = Object.fromEntries(
    AMERICAN_FOOTBALL_LEAGUES.map((l) => [Number(l.slug), l.name]),
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
              id: match.id,
              matchSlug: `${match.tournament.uniqueTournament.id}/${match.season.id}/${match.id}`,
              sport: SPORT.AMERICAN_FOOTBALL,
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
                img: resolveNFLImages(match.homeTeam.name),
                winDrawLoss: match.homeTeamSeasonHistoricalForm
                  ? `${match.homeTeamSeasonHistoricalForm?.wins ?? 0}-${match.homeTeamSeasonHistoricalForm?.losses ?? 0}${match.homeTeamSeasonHistoricalForm?.draws ? "-" + match.homeTeamSeasonHistoricalForm.draws : ""}`
                  : null,
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveNFLImages(match.awayTeam.name),
                winDrawLoss: match.awayTeamSeasonHistoricalForm
                  ? `${match.awayTeamSeasonHistoricalForm?.wins ?? 0}-${match.awayTeamSeasonHistoricalForm?.losses ?? 0}${match.awayTeamSeasonHistoricalForm?.draws ? "-" + match.awayTeamSeasonHistoricalForm.draws : ""}`
                  : null,
              },
            } as MatchSummary;
          }),
        roundLabel: roundLabel,
      } as RoundDetails;
    }),

    currentRound: "NFL",
  } as AmericanFootballFixturesPage;
}
