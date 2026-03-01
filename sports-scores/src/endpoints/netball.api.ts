import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  Netball_SportsDB_DayEvents_Response,
  Netball_SportsDB_LeagueTotalStandings_Response,
  Netball_SportsDB_Match_Response,
  Netball_SportsDB_MatchIncidents_Response,
  Netball_SportsDB_SeasonEvent_Response,
} from "@/types/netball";
import { SportsDB_Events_Response } from "@/types/sportsdb";
import { format } from "date-fns";

// const reqHeaders = new Headers();
// reqHeaders.append("x-rapidapi-key", process.env.RapidAPIKey ?? "");

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.NETBALL,
    );
  }
}

export async function fetchNetballLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NETBALL_BASEURL}/eventspastleague.php?id=${tournamentId}`,
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as Netball_SportsDB_SeasonEvent_Response;
}

export async function fetchNetballNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawMatches = await fetch(
    `${process.env.NETBALL_BASEURL}/eventsnextleague.php?id=${tournamentId}`,
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as Netball_SportsDB_SeasonEvent_Response;
}

export async function fetchNetballSeasonMatches(
  tournamentId: number,
  seasonId: number,
) {
  const rawMatches = await fetch(
    `${process.env.NETBALL_BASEURL}/eventsseason.php?id=${tournamentId}&s=${seasonId}`,
  );

  if (!rawMatches.ok || rawMatches.status === 204) {
    return null;
  }

  updateQuota(rawMatches);

  return (await rawMatches.json()) as SportsDB_Events_Response;
}

export async function fetchNetballStandings(
  tournamentId: number,
  seasonId: number,
) {
  return null;
  const rawStandings = await fetch(
    `${process.env.NETBALL_BASEURL}/netball/tournament/${tournamentId}/season/${seasonId}/standings/total`,
  );

  if (!rawStandings.ok || rawStandings.status === 204) {
    return null;
  }

  updateQuota(rawStandings);

  return (await rawStandings.json()) as Netball_SportsDB_LeagueTotalStandings_Response;
}

export async function fetchNetballMatchDetails(matchId: number) {
  const rawMatch = await fetch(
    `${process.env.NETBALL_BASEURL}/lookupevent.php?id=${matchId}`,
  );

  if (!rawMatch.ok || rawMatch.status === 204) {
    return null;
  }

  updateQuota(rawMatch);

  return (await rawMatch.json()) as Netball_SportsDB_Match_Response;
}

export async function fetchNetballMatchIncidents(matchId: number) {
  return null;
  const rawMatch = await fetch(
    `${process.env.NETBALL_BASEURL}/netball/match/${matchId}/incidents`,
  );

  if (!rawMatch.ok || rawMatch.status === 204) {
    return null;
  }

  updateQuota(rawMatch);

  return (await rawMatch.json()) as Netball_SportsDB_MatchIncidents_Response;
}

export async function fetchNetballMatchesByDate(date: Date) {
  const rawFixtures = await fetch(
    `${process.env.NETBALL_BASEURL}/eventsday.php?d=${format(date, "yyyy-MM-dd")}&s=Netball${date.getMonth() > 1 && date.getMonth() < 7 ? "&l=Australian Super Netball League" : ""}`,
  );

  if (!rawFixtures.ok || rawFixtures.status === 204) {
    return null;
  }

  updateQuota(rawFixtures);

  return (await rawFixtures.json()) as Netball_SportsDB_DayEvents_Response;
}
