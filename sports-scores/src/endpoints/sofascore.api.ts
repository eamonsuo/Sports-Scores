import { Sofascore_EventPage_Response } from "@/types/sofascore"

const SOFASCOREBASEURL = "https://www.sofascore.com/api/v1"
const errorCodesToNullify = [204, 404]

async function fetchSofascoreApi(endpoint: string) {
  const res = await fetch(SOFASCOREBASEURL + endpoint)

  if (!res.ok || errorCodesToNullify.includes(res.status)) {
    return null
  }

  return res.json()
}

export async function fetchLastEvents(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreApi(
    `/unique-tournament/${tournamentId}/season/${seasonId}/events/last/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}

export async function fetchNextEvents(
  tournamentId: string,
  seasonId: string,
  pageNumber: number = 0,
) {
  return (await fetchSofascoreApi(
    `/unique-tournament/${tournamentId}/season/${seasonId}/events/next/${pageNumber}`,
  )) as Sofascore_EventPage_Response
}
