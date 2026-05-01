import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
  Sofascore_TournamentCupTrees_Response,
  SofascoreSportURL,
} from "@/types/sofascore";
import { format } from "date-fns";

const SOFASCOREBASEURL = "https://www.sofascore.com/api/v1";
const errorCodesToNullify = [204, 404];

async function fetchSofascoreApi(endpoint: string) {
  const res = await fetch(SOFASCOREBASEURL + endpoint);

  if (!res.ok || errorCodesToNullify.includes(res.status)) {
    return null;
  }

  return res.json();
}

export async function fetchLastEvents(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreApi(
    `/unique-tournament/${tournamentId}/season/${seasonId}/events/last/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchNextEvents(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreApi(
    `/unique-tournament/${tournamentId}/season/${seasonId}/events/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchStandingsTotal(
  tournamentId: string,
  seasonId: string,
) {
  return (await fetchSofascoreApi(
    `/unique-tournament/${tournamentId}/season/${seasonId}/standings/total`,
  )) as Sofascore_TotalStandings_Response;
}

export async function fetchEventDetails(eventId: string) {
  return (await fetchSofascoreApi(
    `/event/${eventId}`,
  )) as Sofascore_Event_Response;
}

export async function fetchEventIncidents(eventId: string) {
  return (await fetchSofascoreApi(
    `/event/${eventId}/incidents`,
  )) as Sofascore_EventIncidents_Response;
}

export async function fetchEventsByDate(sport: SofascoreSportURL, date: Date) {
  return (await fetchSofascoreApi(
    `/sport/${sport}/scheduled-events/${format(date, "yyyy-MM-dd")}`,
  )) as Sofascore_Events_Response;
}

// Placeholder functions - to be implemented
export async function fetchTeamLastEvents(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreApi(
    `/team/${teamId}/events/last/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchTeamNextEvents(
  teamId: string,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreApi(
    `/team/${teamId}/events/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response;
}

export async function fetchCupTrees(tournamentId: string, seasonId: string) {
  return (await fetchSofascoreApi(
    `/unique-tournament/${tournamentId}/season/${seasonId}/cuptrees`,
  )) as Sofascore_TournamentCupTrees_Response;
}

export async function fetchPlayerRankings(rankingId: string) {
  return (await fetchSofascoreApi(
    `/rankings/${rankingId}`,
  )) as Sofascore_TournamentCupTrees_Response;
}
