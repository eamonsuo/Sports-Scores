import {
  fetchMatchDetails,
  fetchMatchIncidents,
  fetchTournamentLastMatches,
  fetchTournamentNextMatches,
  fetchTournamentStandings,
} from "@/endpoints/sofascore.api";
import { aflTeamNames } from "@/lib/constants";
import { resolveAFLImages } from "@/lib/imageMapping";
import {
  setMatchSummary,
  shortenTeamNames,
  toShortTimeString,
} from "@/lib/projUtils";
import {
  AFLFixturesPage,
  AFLLadderPage,
  AFLMatchPage,
  AFLStanding,
} from "@/types/afl";
import { MatchSummary, RoundDetails, SPORT } from "@/types/misc";

const seasonId = 71308; //2025 season
const tournamentId = 656; //AFL Tournament ID

export async function AFLMatches() {
  const lastMatches = await fetchTournamentLastMatches(
    tournamentId,
    seasonId,
    0,
  );
  const nextMatches = await fetchTournamentNextMatches(
    tournamentId,
    seasonId,
    0,
  );

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = (lastMatches?.events ?? []).concat(nextMatches?.events ?? []);
  const rounds = [...new Set(matches.map((item) => item.roundInfo.round ?? 0))];

  return {
    fixtures: rounds.map((round) => {
      //Get all teams playing in the round
      let teams = matches
        .filter((item) => item.roundInfo.round === round)
        .flatMap((game) => [game.homeTeam.name, game.awayTeam.name]);

      return {
        matches: matches
          .filter((item) => item.roundInfo.round === round)
          .map((match) => {
            var startDate = new Date(0);
            startDate.setUTCSeconds(match.startTimestamp);

            return {
              startDate: startDate,
              roundLabel: `Round ${match.roundInfo.round}`,
              timer:
                match.status.type === "notstarted"
                  ? toShortTimeString(startDate)
                  : match.status.description,
              id: match.id,
              sport: SPORT.AFL,
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
                img: resolveAFLImages(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveAFLImages(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: `Round ${round}`,
        byes: aflTeamNames
          .filter((x) => !teams.includes(x))
          .map((team) => {
            return { name: team, img: resolveAFLImages(team) };
          }),
      } as RoundDetails;
    }),

    currentRound: `Round ${
      nextMatches?.events[0]?.roundInfo.round ??
      lastMatches?.events[lastMatches?.events.length - 1]?.roundInfo.round ??
      0
    }`,
  } as AFLFixturesPage;
}

export async function AFLStandings() {
  const standings = await fetchTournamentStandings(tournamentId, seasonId);

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
          logo: resolveAFLImages(item.team.name),
        },
        games: {
          played: item.matches,
          win: item.wins,
          lost: item.losses,
          drawn: item.draws,
        },
        scores: { against: item.scoresAgainst, for: item.scoresFor },
      } as AFLStanding;
    }),
  } as AFLLadderPage;
}

export async function AFLMatchDetails(matchId: number) {
  const match = await fetchMatchDetails(matchId);
  const incidents = await fetchMatchIncidents(matchId);

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
            img: resolveAFLImages(matchDetails.homeTeam.name),
          },
          awayTeam: {
            name: shortenTeamNames(matchDetails?.awayTeam.name),
            score: matchDetails?.awayScore?.current?.toString() ?? "0",
            img: resolveAFLImages(matchDetails.awayTeam.name),
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
  } as AFLMatchPage;
}
