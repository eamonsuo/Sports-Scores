import { updateQuota } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import {
  Netball_SportsDB_LeagueTotalStandings_Response,
  Netball_SportsDB_MatchIncidents_Response,
} from "@/types/netball"
import { SportsDB_Events_Response } from "@/types/sportsdb"
import { format } from "date-fns"

async function fetchNetballApi<T>(endpoint: string) {
  const url = process.env.NETBALL_BASEURL + endpoint
  const res = await fetch(url)

  if (!res.ok || res.status === 204) {
    return null
  }

  updateQuota(res, SPORT.NETBALL)

  return res.json() as Promise<T>
}

export async function fetchNetballLastMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchNetballApi<SportsDB_Events_Response>(
    `/eventspastleague.php?id=${tournamentId}`,
  )
}

export async function fetchNetballNextMatches(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return fetchNetballApi<SportsDB_Events_Response>(
    `/eventsnextleague.php?id=${tournamentId}`,
  )
}

export async function fetchNetballSeasonMatches(
  tournamentId: string,
  seasonId: string,
) {
  return fetchNetballApi<SportsDB_Events_Response>(
    `/eventsseason.php?id=${tournamentId}&s=${seasonId}`,
  )
}

export async function fetchNetballStandings(
  tournamentId: string,
  seasonId: string,
): Promise<Netball_SportsDB_LeagueTotalStandings_Response | null> {
  return null
}

export async function fetchNetballMatchDetails(matchId: string) {
  return fetchNetballApi<SportsDB_Events_Response>(
    `/lookupevent.php?id=${matchId}`,
  )
}

export async function fetchNetballMatchIncidents(
  matchId: string,
): Promise<Netball_SportsDB_MatchIncidents_Response | null> {
  return null
}

export async function fetchNetballMatchesByDate(date: Date) {
  return fetchNetballApi<SportsDB_Events_Response>(
    `/eventsday.php?d=${format(date, "yyyy-MM-dd")}&s=Netball${date.getMonth() > 1 && date.getMonth() < 7 ? "&l=Australian Super Netball League" : ""}`,
  )
}
