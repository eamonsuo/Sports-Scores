import {
  fetchCricketAllSeries,
  fetchCricketCurrentMatches,
  fetchCricketMyTeams,
} from "@/api/cricket.api";
import {
  mapCricketCurrentMatches,
  mapCricketTeamMatches,
} from "@/lib/dataMapping";

export async function cricketCurrentMatches() {
  const rawMatches = await fetchCricketCurrentMatches();

  if (rawMatches === null) {
    return null;
  }

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
