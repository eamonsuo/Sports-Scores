import { Match as BracketMatch } from "@/components/bracket/types";
import {
  fetchFootballCupTrees,
  fetchFootballLastMatches,
  fetchFootballMatchDetails,
  fetchFootballMatchesByDate,
  fetchFootballMatchIncidents,
  fetchFootballNextMatches,
  fetchFootballStandings,
  fetchFootballTeamLastMatches,
  fetchFootballTeamNextMatches,
} from "@/endpoints/football.api";
import { fetchCupTrees } from "@/endpoints/sofascore.api";
import {
  FOOTBALL_LADDER_HEADINGS,
  FOOTBALL_LEAGUES,
  SCORE_BREAKDOWN_HALVES_CONFIG,
} from "@/lib/constants";
import { FootballBracketPage } from "@/types/football";
import { SPORT } from "@/types/misc";
import { SofascoreSportURL } from "@/types/sofascore";
import { SofascoreSport } from "./sofascore.service";

class FootballService extends SofascoreSport {
  constructor() {
    super(
      {
        fetchLastEvents: fetchFootballLastMatches,
        fetchNextEvents: fetchFootballNextMatches,
        fetchEventsByDate: fetchFootballMatchesByDate,
        fetchEventDetails: fetchFootballMatchDetails,
        fetchEventIncidents: fetchFootballMatchIncidents,
        fetchStandingsTotal: fetchFootballStandings,
        fetchCupTrees: fetchFootballCupTrees,
        fetchPlayerRankings: async () => null,
        fetchTeamLastEvents: fetchFootballTeamLastMatches,
        fetchTeamNextEvents: fetchFootballTeamNextMatches,
      },
      SPORT.FOOTBALL,
      SofascoreSportURL.FOOTBALL,
      FOOTBALL_LEAGUES,
      FOOTBALL_LADDER_HEADINGS,
      SCORE_BREAKDOWN_HALVES_CONFIG,
    );
  }

  async footballBrackets(tournamentId: number, seasonId: number) {
    const trees = await (
      process.env.DEV_MODE ? fetchCupTrees : fetchFootballCupTrees
    )(tournamentId, seasonId);
    // const trees = testdata;

    console.log("🟢 Starting footballBrackets processing...");
    console.log("Trees count:", trees?.cupTrees?.length);

    if (!trees) {
      return null;
    }

    console.log("Creating tempBrackets...");
    const tempBrackets = trees.cupTrees.map((tree) => {
      console.log(
        `Processing tree: ${tree.name}, rounds: ${tree.rounds.length}`,
      );
      return {
        id: tree.id,
        name: tree.name,
        currentRound: tree.currentRound,
        matches: tree.rounds.flatMap((round, roundIndex) =>
          round.blocks.map(
            (match) =>
              ({
                id: match.blockId,
                nextMatchId: null,
                participants: match.participants.map((team, teamIndex) => ({
                  id: team.team.id,
                  isWinner: team.winner,
                  name: team.team.name,
                  resultText:
                    teamIndex === 0 ? match.homeTeamScore : match.awayTeamScore,
                  status: match.finished ? "PLAYED" : "SCHEDULED",
                })),
                startTime: match.seriesStartDateTimestamp?.toString(),
                tournamentRoundText: (roundIndex + 1).toString(),
                state: match.finished ? "PLAYED" : "SCHEDULED",
                name: "",
                href: `./match/${match?.events?.[0] ?? ""}`,
              }) as BracketMatch,
          ),
        ),
      };
    });
    console.log(
      "tempBrackets created, total matches:",
      tempBrackets.flatMap((b) => b.matches).length,
    );

    console.log("Setting up nextMatchId connections...");
    // Build a lookup map first to avoid O(n²) complexity
    const matchMap = new Map();
    tempBrackets.forEach((bracket) => {
      bracket.matches.forEach((match) => {
        matchMap.set(match.id, match);
      });
    });

    trees.cupTrees.forEach((tree) => {
      tree.rounds.forEach((round) => {
        round.blocks.forEach((match) => {
          match.participants.forEach((team) => {
            if (team.sourceBlockId) {
              const matchToUpdate = matchMap.get(team.sourceBlockId);
              if (matchToUpdate) {
                matchToUpdate.nextMatchId = match.blockId;
              }
            }
          });
        });
      });
    });

    console.log("footballBrackets processing complete");
    return {
      brackets: tempBrackets,
    } as FootballBracketPage;
  }
}

export const footballService = new FootballService();
