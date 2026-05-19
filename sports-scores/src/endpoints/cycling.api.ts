import { updateQuota } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"

async function fetchCyclingApi(endpoint: string) {
  const url = process.env.CYCLING_BASEURL + endpoint
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RapidAPIKey ?? "",
    },
  })

  if (!res.ok || res.status === 204) {
    return null
  }

  updateQuota(res, SPORT.CYCLING)

  return res.json()
}

export async function fetchCyclingSeasonRaces(seasonId: string) {
  return (await fetchCyclingApi(`/cycling/stage/${seasonId}/extended`)) as any
}

export async function fetchCyclingRaceStages(stageId: string) {
  return (await fetchCyclingApi(`/cycling/stage/${stageId}/substages`)) as any
}

export async function fetchCyclingRiderSeasonRaces(
  riderId: string,
  seasonId: string,
) {
  return (await fetchCyclingApi(
    `/cycling/team/${riderId}/stage/season/${seasonId}/races`,
  )) as any
}
