import { updateQuota } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"

async function fetchMotorsportApi(endpoint: string) {
  const url = process.env.MOTORSPORT_BASEURL + endpoint
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  })

  if (!res.ok || res.status === 204) {
    return null
  }

  updateQuota(res, SPORT.MOTORSPORT)

  return res.json()
}

export async function fetchMotorsportSeasonRaces(seasonId: string) {
  return (await fetchMotorsportApi(`/stage/${seasonId}/extended`)) as any
}

export async function fetchMotorsportRaceStages(stageId: string) {
  return (await fetchMotorsportApi(`/stage/${stageId}/substages`)) as any
}

export async function fetchMotorsportRiderSeasonRaces(
  riderId: string,
  seasonId: string,
) {
  return (await fetchMotorsportApi(
    `/team/${riderId}/stage/season/${seasonId}/races`,
  )) as any
}
