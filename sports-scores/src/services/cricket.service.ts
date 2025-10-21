import { CricketScorecardPage } from "@/app/sports/cricket/match/[slug]/page";
import { MatchDetailsPage } from "@/components/cricket/CricketMatchDetailsPage";
import {
  fetchCricketAllSeries,
  fetchCricketMatchDetails,
  fetchCricketMatchesByDate,
  fetchCricketMatchInnings,
  fetchCricketMyTeams,
  fetchCricketSeriesMatches,
} from "@/endpoints/cricket.api";
import {
  mapCricketCurrentMatches,
  mapCricketSeriesLadders,
  mapCricketSeriesMatches,
  mapCricketTeamMatches,
  mapMatchDetails,
  mapScorecardDetails,
} from "@/lib/dataMapping";

// Fetch matches for a specific date
export async function cricketMatchesByDate(date: Date) {
  const rawMatches = await fetchCricketMatchesByDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  if (!rawMatches || !rawMatches.Stages) return null;

  return mapCricketCurrentMatches(rawMatches);
}

export async function cricketMyTeamsMatches() {
  const rawTeamDetails = await fetchCricketMyTeams();

  if (rawTeamDetails === null) {
    return null;
  }

  return mapCricketTeamMatches(rawTeamDetails);
}

export async function cricketAllSeries() {
  const rawTeamDetails = await fetchCricketAllSeries();

  if (rawTeamDetails === null) {
    return null;
  }

  return rawTeamDetails;
}

export async function cricketMatchDetails(id: number): Promise<{
  matchDetails: MatchDetailsPage;
  matchScorecard: CricketScorecardPage;
  matchSeries: string;
} | null> {
  const rawInnings = await fetchCricketMatchInnings(id);
  const rawDetails = await fetchCricketMatchDetails(id);

  if (rawInnings === null || rawDetails === null) {
    return null;
  }

  const detailsPage = mapMatchDetails(rawDetails, rawInnings);
  const scorecardPage = mapScorecardDetails(rawInnings);

  return {
    matchDetails: detailsPage,
    matchScorecard: scorecardPage,
    matchSeries: `${rawDetails.Stg.Ccd}/${rawDetails.Stg.Scd}`,
  };
}

export async function cricketSeriesResults(ccd: string, scd: string) {
  let rawSeries = await fetchCricketSeriesMatches(ccd, scd);

  if (
    rawSeries?.Stages[0].LeagueTable === undefined ||
    rawSeries === null ||
    rawSeries === undefined
  ) {
    return null;
  }

  return mapCricketSeriesLadders(rawSeries.Stages[0].LeagueTable);
}

export async function cricketSeriesDetails(ccd: string, scd: string) {
  let rawMatches = await fetchCricketSeriesMatches(ccd, scd);

  if (rawMatches == undefined || rawMatches.Stages == undefined) {
    return null;
  }

  return mapCricketSeriesMatches(rawMatches);
}
