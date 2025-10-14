import { fetchFootballFixturesByLeague } from "@/endpoints/football.api";
import { RoundDetails } from "@/types/misc";

export async function footballLeagueMatches(
  leagueId: string,
  seasonId: string,
) {
  const rawMatches = await fetchFootballFixturesByLeague(leagueId);

  if (rawMatches === null) {
    return null;
  }

  return {
    fixtures: [{}] as RoundDetails[],
    currentRound: "0",
  };
}
