import { fetchRapidApi } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import { Sofascore_StageStanding_Response } from "@/types/sofascore"

async function fetchCyclingApi<T>(endpoint: string) {
  return fetchRapidApi<T>(process.env.CYCLING_BASEURL, endpoint, SPORT.CYCLING)
}

export async function fetchCyclingSeasonRaces(seasonId: string) {
  return fetchCyclingApi<any>(`/cycling/stage/${seasonId}/extended`)
}

//Use Categories to get stage id
//Use UniqueStageSeasons to get season for a stage id
//Use StageSubstages to get season races for a uniquestage id
export async function fetchCyclingSubstages(stageId: string) {
  return fetchCyclingApi<any>(`/cycling/stage/${stageId}/substages`)
}

export async function fetchCyclingRiderStandings(stageId: string) {
  return fetchCyclingApi<Sofascore_StageStanding_Response>(
    `/cycling/stage/${stageId}/standings/competitor`,
  )
}

export async function fetchCyclingRiderSeasonRaces(
  riderId: string,
  seasonId: string,
) {
  return fetchCyclingApi<any>(
    `/cycling/team/${riderId}/stage/season/${seasonId}/races`,
  )
}

export async function fetchCyclingTeamStandings(stageId: string) {
  return fetchCyclingApi<Sofascore_StageStanding_Response>(
    `/cycling/stage/${stageId}/standings/team`,
  )
}
