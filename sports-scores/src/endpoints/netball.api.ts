import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  Netball_SportsDB_LeagueTotalStandings_Response,
  Netball_SportsDB_MatchIncidents_Response,
} from "@/types/netball";
import { SportsDB_Events_Response } from "@/types/sportsdb";
import { format } from "date-fns";

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

async function fetchNetballApi(endpoint: string) {
  const url = process.env.NETBALL_BASEURL + endpoint;
  const res = await fetch(url);

  if (!res.ok || res.status === 204) {
    return null;
  }

  updateQuota(res);

  return res.json();
}

export async function fetchNetballLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchNetballApi(
    `/eventspastleague.php?id=${tournamentId}`,
  )) as SportsDB_Events_Response;
}

export async function fetchNetballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchNetballApi(
    `/eventsnextleague.php?id=${tournamentId}`,
  )) as SportsDB_Events_Response;
}

export async function fetchNetballSeasonMatches(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchNetballApi(
    `/eventsseason.php?id=${tournamentId}&s=${seasonId}`,
  )) as SportsDB_Events_Response;
}

export async function fetchNetballStandings(
  tournamentId: string,
  seasonId: string,
): Promise<Netball_SportsDB_LeagueTotalStandings_Response | null> {
  return null;
}

export async function fetchNetballMatchDetails(matchId: string) {
  return (await fetchNetballApi(
    `/lookupevent.php?id=${matchId}`,
  )) as SportsDB_Events_Response;
}

export async function fetchNetballMatchIncidents(
  matchId: string,
): Promise<Netball_SportsDB_MatchIncidents_Response | null> {
  return null;
}

export async function fetchNetballMatchesByDate(date: Date) {
  return (await fetchNetballApi(
    `/eventsday.php?d=${format(date, "yyyy-MM-dd")}&s=Netball${date.getMonth() > 1 && date.getMonth() < 7 ? "&l=Australian Super Netball League" : ""}`,
  )) as SportsDB_Events_Response;
}
