import { fetchRapidApi } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import {
  Sofascore_Stages_Response,
  Sofascore_StageStanding_Response,
} from "@/types/sofascore"

async function fetchMotorsportApi<T>(endpoint: string) {
  return fetchRapidApi<T>(
    process.env.MOTORSPORT_BASEURL,
    endpoint,
    SPORT.MOTORSPORT,
  )
}

//Use Categories to get stage id
//Use UniqueStageSeasons to get season for a stage id
//Use StageSubstages to get season races for a uniquestage id
export async function fetchMotorsportSubstages(stageId: string) {
  return fetchMotorsportApi<Sofascore_Stages_Response>(
    `/stage/${stageId}/substages`,
  )
}

export async function fetchMotorsportDriverStandings(stageId: string) {
  return fetchMotorsportApi<Sofascore_StageStanding_Response>(
    `/stage/${stageId}/standings/competitor`,
  )
}

export async function fetchMotorsportDriverSeasonRaces(
  teamId: string,
  seasonId: string,
) {
  return fetchMotorsportApi<any>(
    `/team/${teamId}/stage/season/${seasonId}/races`,
  )
}

export async function fetchMotorsportTeamStandings(stageId: string) {
  return fetchMotorsportApi<Sofascore_StageStanding_Response>(
    `/stage/${stageId}/standings/team`,
  )
}
