import { updateQuota } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import {
  Sofascore_Stages_Response,
  Sofascore_StageStanding_Response,
} from "@/types/sofascore"

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

//Use Categories to get stage id
//Use UniqueStageSeasons to get season for a stage id
//Use StageSubstages to get season races for a uniquestage id
export async function fetchMotorsportSubstages(stageId: string) {
  return (await fetchMotorsportApi(
    `/stage/${stageId}/substages`,
  )) as Sofascore_Stages_Response
}

export async function fetchMotorsportStageStandings(stageId: string) {
  return (await fetchMotorsportApi(
    `/stage/${stageId}/standings/competitor`,
  )) as Sofascore_StageStanding_Response
}

export async function fetchMotorsportDriverSeasonRaces(
  teamId: string,
  seasonId: string,
) {
  return (await fetchMotorsportApi(
    `/team/${teamId}/stage/season/${seasonId}/races`,
  )) as any
}
