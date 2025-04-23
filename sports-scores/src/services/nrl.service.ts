import { NRLStanding } from "@/components/nrl/NRLLadder";
import {
  fetchNRLLastMatches,
  fetchNRLMatchDetails,
  fetchNRLMatchIncidents,
  fetchNRLNextMatches,
  fetchNRLStandings,
} from "@/endpoints/nrl.api";
import {
  setMatchSummary,
  shortenTeamNames,
  toShortTimeString,
} from "@/lib/projUtils";
import { MatchSummary } from "@/types/misc";
import { NRLFixturesPage, NRLLadderPage, NRLMatchPage } from "@/types/nrl";

export async function NRLMatches() {
  const lastMatches = await fetchNRLLastMatches(2025, 0);
  const nextMatches = await fetchNRLNextMatches(2025, 0);

  if (!lastMatches || !nextMatches) {
    return null;
  }

  const matches = lastMatches?.events.concat(nextMatches?.events ?? []) ?? [];

  return {
    fixtures: matches.map((match) => {
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
        sport: "nrl",
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
        },
        awayDetails: {
          name: shortenTeamNames(match.awayTeam.name),
          score: match.awayScore.current?.toString() ?? "0",
        },
      } as MatchSummary;
    }),
  } as NRLFixturesPage;
}

export async function NRLStandings() {
  const standings = await fetchNRLStandings(2025);

  if (!standings) {
    return null;
  }

  return {
    standings: standings?.standings[0].rows.map((item) => {
      return {
        position: item.position,
        points: item.points,
        team: { id: item.team.id, name: shortenTeamNames(item.team.name) },
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
  const scoreIncidents = incidents?.incidents.filter(
    (item) => item.incidentType === "goal",
  );

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
            score: matchDetails?.homeScore.current.toString() ?? "0",
          },
          awayTeam: {
            name: shortenTeamNames(matchDetails?.awayTeam.name),
            score: matchDetails?.awayScore.current.toString() ?? "0",
          },
          scoreBreakdown: [
            {
              periodName: "1st Half",
              teams: {
                home: { score: matchDetails.homeScore.period1 },
                away: { score: matchDetails.awayScore.period1 },
              },
            },
            {
              periodName: "2nd Half",
              teams: {
                home: { score: matchDetails.homeScore.period2 },
                away: { score: matchDetails.awayScore.period2 },
              },
            },
          ],
        },
  } as NRLMatchPage;
}
