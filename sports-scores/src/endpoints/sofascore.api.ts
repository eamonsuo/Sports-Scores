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
    console.log(rawEvents.status);
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
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,en-AU;q=0.8",
        baggage:
          "sentry-environment=production,sentry-release=lDrhfvdVeEz69JNkkuy_a,sentry-public_key=d693747a6bb242d9bb9cf7069fb57988,sentry-trace_id=85ce8f88bbb1aa6a54f2c6d5496e0f4c",
        "cache-control": "max-age=0",
        "if-none-match": 'W/"372e8c00d6"',
        "sec-ch-ua":
          '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"iOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sentry-trace": "85ce8f88bbb1aa6a54f2c6d5496e0f4c-8f78d03e080f2513",
        "x-requested-with": "a64fa0",
        cookie:
          '_gcl_au=1.1.1046103336.1770438602; _ga=GA1.1.1249611337.1770438602; g_state={"i_l":0,"i_ll":1771648090807,"i_b":"WI2oFjPNv35lvhv63istjljEbaBSVEsZQ2B6MaqHBkA","i_e":{"enable_itp_optimization":0}}; _ga_HNQ9P9MGZR=GS2.1.s1771658994$o41$g1$t1771659006$j48$l0$h0',
        Referer:
          "https://www.sofascore.com/rugby/tournament/rugby-league/nrl/294",
      },
    },
  );

  if (!rawEvents.ok || errorCodesToNullify.includes(rawEvents.status)) {
    console.log(rawEvents.status);
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
    console.log(rawStandings.status);
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
