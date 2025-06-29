import { NRLStanding } from "@/components/nrl/NRLLadder";
import {
  fetchNRLLastMatches,
  fetchNRLMatchDetails,
  fetchNRLMatchIncidents,
  fetchNRLNextMatches,
  fetchNRLStandings,
} from "@/endpoints/nrl.api";
import { nrlTeamNames } from "@/lib/constants";
import {
  resolveNRLImages,
  setMatchSummary,
  shortenTeamNames,
  toShortTimeString,
} from "@/lib/projUtils";
import { MatchSummary, RoundDetails, SPORT } from "@/types/misc";
import { NRLFixturesPage, NRLLadderPage, NRLMatchPage } from "@/types/nrl";

const seasonId = 69277; // 2025 NRL Season

export async function NRLMatches() {
  const lastMatches = await fetchNRLLastMatches(seasonId, 0);
  const nextMatches = await fetchNRLNextMatches(seasonId, 0);

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
              sport: SPORT.NRL,
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
                img: resolveNRLImages(match.homeTeam.name),
              },
              awayDetails: {
                name: shortenTeamNames(match.awayTeam.name),
                score: match.awayScore.current?.toString() ?? "0",
                img: resolveNRLImages(match.awayTeam.name),
              },
            } as MatchSummary;
          }),
        roundLabel: `Round ${round}`,
        byes: nrlTeamNames
          .filter((x) => !teams.includes(x))
          .map((team) => {
            return { name: team, img: resolveNRLImages(team) };
          }),
      } as RoundDetails;
    }),

    currentRound: `Round ${
      nextMatches?.events[0]?.roundInfo.round ??
      lastMatches?.events[lastMatches?.events.length - 1]?.roundInfo.round ??
      0
    }`,
  } as NRLFixturesPage;
}

export async function NRLStandings() {
  const standings = await fetchNRLStandings(seasonId);

  if (!standings) {
    return null;
  }

  return {
    standings: standings?.standings[0].rows.map((item) => {
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
      } as NRLStanding;
    }),
  } as NRLLadderPage;
}

export async function NRLMatchDetails(matchId: number) {
  const match = await fetchNRLMatchDetails(matchId);
  const incidents = await fetchNRLMatchIncidents(matchId);

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
  } as NRLMatchPage;
}
