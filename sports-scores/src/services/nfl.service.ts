import { NFLStanding, NFLTeamStanding } from "@/components/nfl/NFLLadder";
import {
  fetchNFLLastMatches,
  fetchNFLMatchDetails,
  fetchNFLMatchIncidents,
  fetchNFLNextMatches,
  fetchNFLStandings,
} from "@/endpoints/nfl.api";
import {
  resolveNFLImages,
  setMatchSummary,
  shortenTeamNames,
  toShortTimeString,
} from "@/lib/projUtils";
import { MatchSummary, SPORT } from "@/types/misc";
import { NFLFixturesPage, NFLLadderPage, NFLMatchPage } from "@/types/nfl";

export async function NFLMatches() {
  const lastMatches = await fetchNFLLastMatches(2024, 0);
  const nextMatches = await fetchNFLNextMatches(2024, 0);

  if (!lastMatches && !nextMatches) {
    return null;
  }

  const matches = lastMatches?.events.concat(nextMatches?.events ?? []) ?? [];

  return {
    fixtures: matches.map((match) => {
      var startDate = new Date(0);
      startDate.setUTCSeconds(match.startTimestamp);

      return {
        startDate: startDate,
        roundLabel: match.roundInfo.name ?? `Week ${match.roundInfo.round}`,
        timer:
          match.status.type === "notstarted"
            ? toShortTimeString(startDate)
            : match.status.description,
        id: match.id,
        sport: SPORT.NFL,
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
        },
        awayDetails: {
          name: shortenTeamNames(match.awayTeam.name),
          score: match.awayScore.current?.toString() ?? "0",
          img: resolveNFLImages(match.awayTeam.name),
        },
      } as MatchSummary;
    }),
  } as NFLFixturesPage;
}

export async function NFLStandings() {
  const standings = await fetchNFLStandings(2025);

  if (!standings) {
    return null;
  }

  return {
    tables: standings?.standings
      .filter((item) => {
        return (
          item.name !== "AFC" && item.name !== "NFC" && item.name !== "NFL"
        );
      })
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
            } as NFLTeamStanding;
          }),
        } as NFLStanding;
      }),
  } as NFLLadderPage;
}

export async function NFLMatchDetails(matchId: number) {
  const match = await fetchNFLMatchDetails(matchId);
  const incidents = await fetchNFLMatchIncidents(matchId);

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
  } as NFLMatchPage;
}
