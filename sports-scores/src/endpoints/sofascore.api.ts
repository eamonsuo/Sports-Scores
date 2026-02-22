import {
  Sofascore_Event_Response,
  Sofascore_EventIncidents_Response,
  Sofascore_EventPage_Response,
  Sofascore_Events_Response,
  Sofascore_TotalStandings_Response,
  SofascoreSport,
} from "@/types/sofascore";
import { format } from "date-fns";

const SOFASCOREBASEURL = "https://www.sofascore.com/api/v1";
const errorCodesToNullify = [204, 404];

export async function fetchLastEvents(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawEvents = await fetch(
    `${SOFASCOREBASEURL}/unique-tournament/${tournamentId}/season/${seasonId}/events/last/${pageNumber}`,
  );

  if (!rawEvents.ok || errorCodesToNullify.includes(rawEvents.status)) {
    return null;
  }

  return (await rawEvents.json()) as Sofascore_EventPage_Response;
}

export async function fetchNextEvents(
  tournamentId: number,
  seasonId: number,
  pageNumber: number = 0,
) {
  const rawEvents = await fetch(
    `${SOFASCOREBASEURL}/unique-tournament/${tournamentId}/season/${seasonId}/events/next/${pageNumber}`,
  );

  if (!rawEvents.ok || errorCodesToNullify.includes(rawEvents.status)) {
    return null;
  }

  return (await rawEvents.json()) as Sofascore_EventPage_Response;
}

export async function fetchStandingsTotal(
  tournamentId: number,
  seasonId: number,
) {
  const rawStandings = await fetch(
    `${SOFASCOREBASEURL}/unique-tournament/${tournamentId}/season/${seasonId}/standings/total`,
  );

  if (!rawStandings.ok || errorCodesToNullify.includes(rawStandings.status)) {
    return null;
  }

  return (await rawStandings.json()) as Sofascore_TotalStandings_Response;
}

export async function fetchEventDetails(eventId: number) {
  const rawEvent = await fetch(`${SOFASCOREBASEURL}/event/${eventId}`);

  if (!rawEvent.ok || errorCodesToNullify.includes(rawEvent.status)) {
    return null;
  }

  return (await rawEvent.json()) as Sofascore_Event_Response;
}

export async function fetchEventIncidents(eventId: number) {
  const rawEvent = await fetch(
    `${SOFASCOREBASEURL}/event/${eventId}/incidents`,
  );

  if (!rawEvent.ok || errorCodesToNullify.includes(rawEvent.status)) {
    return null;
  }

  return (await rawEvent.json()) as Sofascore_EventIncidents_Response;
}

export async function fetchEventsByDate(sport: SofascoreSport, date: Date) {
  const rawEvents = await fetch(
    `${SOFASCOREBASEURL}/sport/${sport}/scheduled-events/${format(date, "yyyy-MM-dd")}`,
  );

  if (!rawEvents.ok || errorCodesToNullify.includes(rawEvents.status)) {
    return null;
  }

  return (await rawEvents.json()) as Sofascore_Events_Response;
}
