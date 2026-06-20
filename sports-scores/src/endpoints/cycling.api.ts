import { updateQuota } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import { Sofascore_StageStanding_Response } from "@/types/sofascore"

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

//Use Categories to get stage id
//Use UniqueStageSeasons to get season for a stage id
//Use StageSubstages to get season races for a uniquestage id
export async function fetchCyclingSubstages(stageId: string) {
  return (await fetchCyclingApi(`/cycling/stage/${stageId}/substages`)) as any
}

export async function fetchCyclingRiderStandings(stageId: string) {
  return (await fetchCyclingApi(
    `/cycling/stage/${stageId}/standings/competitor`,
  )) as Sofascore_StageStanding_Response
}

export async function fetchCyclingRiderSeasonRaces(
  riderId: string,
  seasonId: string,
) {
  return (await fetchCyclingApi(
    `/cycling/team/${riderId}/stage/season/${seasonId}/races`,
  )) as any
}

export async function fetchCyclingTeamStandings(stageId: string) {
  return (await fetchCyclingApi(
    `/cycling/stage/${stageId}/standings/team`,
  )) as Sofascore_StageStanding_Response
}
