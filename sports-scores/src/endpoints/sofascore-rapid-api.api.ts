import { updateGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";
import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
} from "@/types/sofascore";
import { format } from "date-fns/format";

function updateQuota(response: Response) {
  const limit = response.headers.get("x-ratelimit-requests-limit");
  const remaining = response.headers.get("x-ratelimit-requests-remaining");
  if (remaining && limit) {
    updateGlobalApiQuota(
      parseInt(remaining, 10),
      parseInt(limit, 10),
      SPORT.AUSSIE_RULES,
    );
  }
}

async function fetchSofascoreRapidApi(endpoint: string) {
  const url = process.env.SOFASCORE_API_BASEURL + endpoint;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  });

  if (!res.ok || res.status === 204) {
    return null;
  }

  updateQuota(res);

  return res.json();
}

export async function fetchTournamentLastMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreRapidApi(
    `/tournaments/get-last-matches?tournamentId=${tournamentId}&seasonId=${seasonId}&pageIndex=${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchTournamentNextMatches(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreRapidApi(
    `/tournaments/get-next-matches?tournamentId=${tournamentId}&seasonId=${seasonId}&pageIndex=${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchTournamentStandings(
  tournamentId: number,
  seasonId: number,
) {
  return (await fetchSofascoreRapidApi(
    `/tournaments/get-standings?tournamentId=${tournamentId}&seasonId=${seasonId}&type=total`,
  )) as Sofascore_TotalStandings_Response;
}

export async function fetchMatchDetails(matchId: number) {
  return (await fetchSofascoreRapidApi(
    `/matches/detail?matchId=${matchId}`,
  )) as Sofascore_Event_Response;
}

export async function fetchMatchIncidents(matchId: number) {
  return (await fetchSofascoreRapidApi(
    `/matches/get-incidents?matchId=${matchId}`,
  )) as Sofascore_EventIncidents_Response;
}

export async function fetchScheduledEvents(categoryId: number, date?: Date) {
  return (await fetchSofascoreRapidApi(
    `/tournaments/get-scheduled-events?categoryId=${categoryId}${date ? `&date=${format(date, "yyyy-MM-dd")}` : ""}`,
  )) as Sofascore_Events_Response;
}
