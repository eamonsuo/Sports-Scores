import {
  DataverseCategory,
  DataverseLadderConfig,
  DataverseLeague,
  DataverseMatchSummary,
  DataversePlayoffPictureConfig,
  DataverseResponse,
  DataverseSeason,
  DataverseSport,
  DataverseSportEvent,
  DataverseTVConfig,
} from "@/types/dataverse"
import { cacheLife, cacheTag } from "next/cache"

// Module-scoped token cache

async function getAccessToken() {
  "use cache"
  cacheLife("minutes")
  cacheTag("dataverse-access-token")

  const tokenUrl = `https://login.microsoftonline.com/${process.env.DATAVERSE_TENANT_ID}/oauth2/v2.0/token`

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.DATAVERSE_CLIENT_ID ?? "",
    client_secret: process.env.DATAVERSE_CLIENT_SECRET ?? "",
    scope: `${process.env.DATAVERSE_ENVIRONMENT_URL ?? ""}/.default`,
  })

  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      body,
    })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(
        `[Dataverse] Token request failed: ${res.status} ${res.statusText}`,
        errorBody,
      )
      return null
    }

    const data = await res.json()

    return data.access_token
  } catch (error) {
    console.error("[Dataverse] Token request error:", error)
    return null
  }
}

async function fetchDataverseApi<T>(entity: string, queryParams?: string) {
  const token = await getAccessToken()
  if (!token) return null

  const url = new URL(
    `${process.env.DATAVERSE_ENVIRONMENT_URL}/api/data/v9.2/${entity}`,
  )
  if (queryParams) url.search = `?${queryParams}`

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        Prefer: 'odata.include-annotations="*"',
      },
    })

    if (!res.ok || res.status === 204) {
      const errorBody = await res.text()
      console.error(
        `[Dataverse] API request failed: ${res.status} ${res.statusText} — ${entity}`,
        errorBody,
        res,
      )
      return null
    }

    const data = await res.json()
    return data as T
  } catch (error) {
    console.error(`[Dataverse] API request error (${entity}):`, error)
    return null
  }
}

async function createDataverseRecord(
  entity: string,
  record: Record<string, unknown>,
) {
  const token = await getAccessToken()
  if (!token) return null

  const url = `${process.env.DATAVERSE_ENVIRONMENT_URL}/api/data/v9.2/${entity}`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
      },
      body: JSON.stringify(record),
    })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(
        `[Dataverse] Create failed: ${res.status} ${res.statusText} — ${entity}`,
        errorBody,
      )
      return null
    }

    // Dataverse returns the new record ID in the OData-EntityId header
    const entityId = res.headers.get("OData-EntityId")
    const match = entityId?.match(/\(([^)]+)\)/)
    return match ? match[1] : null
  } catch (error) {
    console.error(`[Dataverse] Create error (${entity}):`, error)
    return null
  }
}

async function updateDataverseRecord(
  entity: string,
  id: string,
  record: Record<string, unknown>,
) {
  const token = await getAccessToken()
  if (!token) return false

  const url = `${process.env.DATAVERSE_ENVIRONMENT_URL}/api/data/v9.2/${entity}(${id})`

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
      },
      body: JSON.stringify(record),
    })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(
        `[Dataverse] Update failed: ${res.status} ${res.statusText} — ${entity}(${id})`,
        errorBody,
      )
      return false
    }

    return true
  } catch (error) {
    console.error(`[Dataverse] Update error (${entity}):`, error)
    return false
  }
}

// --- MatchSummary table ---

export async function fetchDataverseMatchSummaries(
  filters?: string,
  select: string = "*",
  orderBy: string = "ss_startdate asc",
) {
  const queryParams = []
  if (select) queryParams.push(`$select=${select}`)
  if (filters) queryParams.push(`$filter=${filters}`)
  if (orderBy) queryParams.push(`$orderby=${orderBy}`)
  return fetchDataverseApi<DataverseResponse<DataverseMatchSummary>>(
    "ss_matchsummaries",
    queryParams.join("&"),
  )
}

export async function createDataverseMatchSummary(
  record: Omit<DataverseMatchSummary, "ss_matchsummaryid">,
) {
  return createDataverseRecord(
    "ss_matchsummaries",
    record as Record<string, unknown>,
  )
}

export async function updateDataverseMatchSummary(
  id: string,
  record: Partial<Omit<DataverseMatchSummary, "ss_matchsummaryid">>,
) {
  return updateDataverseRecord(
    "ss_matchsummaries",
    id,
    record as Record<string, unknown>,
  )
}

// --- SportEventSchedule table ---

export async function fetchDataverseSportEventSchedules(
  filters?: string,
  select: string = "*",
  orderBy: string = "ss_start_date asc",
) {
  const queryParams = []
  if (select) queryParams.push(`$select=${select}`)
  if (filters) queryParams.push(`$filter=${filters}`)
  if (orderBy) queryParams.push(`$orderby=${orderBy}`)
  return fetchDataverseApi<DataverseResponse<DataverseSportEvent>>(
    "ss_sporteventschedules",
    queryParams.join("&"),
  )
}

// --- Sport table ---
export async function fetchDataverseSports(
  filters?: string,
  select: string = "*",
  orderBy: string = "ss_name asc",
  expand: string = "",
) {
  const queryParams = []
  if (select) queryParams.push(`$select=${select}`)
  if (filters) queryParams.push(`$filter=${filters}`)
  if (orderBy) queryParams.push(`$orderby=${orderBy}`)
  if (expand) queryParams.push(`$expand=${expand}`)
  return fetchDataverseApi<DataverseResponse<DataverseSport>>(
    "ss_sports",
    queryParams.join("&"),
  )
}

export async function createDataverseSport(
  record: Omit<DataverseSport, "ss_sportid">,
) {
  return createDataverseRecord("ss_sports", record as Record<string, unknown>)
}

// --- Category table ---
export async function fetchDataverseCategories(
  filters?: string,
  select: string = "*",
  orderBy: string = "ss_name asc",
  expand: string = "",
) {
  const queryParams = []
  if (select) queryParams.push(`$select=${select}`)
  if (filters) queryParams.push(`$filter=${filters}`)
  if (orderBy) queryParams.push(`$orderby=${orderBy}`)
  if (expand) queryParams.push(`$expand=${expand}`)
  return fetchDataverseApi<DataverseResponse<DataverseCategory>>(
    "ss_categories",
    queryParams.join("&"),
  )
}

// --- League table ---
export async function fetchDataverseLeagues(
  filters?: string,
  select: string = "*",
  orderBy: string = "ss_name asc",
  expand: string = "ss_season_leagueid_ss_league($select=ss_name,ss_slug,ss_sport,_ss_leagueid_value,ss_externalurl,ss_byes)",
) {
  const queryParams = []
  if (select) queryParams.push(`$select=${select}`)
  if (filters) queryParams.push(`$filter=${filters}`)
  if (orderBy) queryParams.push(`$orderby=${orderBy}`)
  if (expand) queryParams.push(`$expand=${expand}`)
  return fetchDataverseApi<DataverseResponse<DataverseLeague>>(
    "ss_leagues",
    queryParams.join("&"),
  )
}

// --- Season table ---
export async function fetchDataverseSeasons(
  filters?: string,
  select: string = "*",
  orderBy: string = "ss_name asc",
  expand: string = "",
) {
  const queryParams = []
  if (select) queryParams.push(`$select=${select}`)
  if (filters) queryParams.push(`$filter=${filters}`)
  if (orderBy) queryParams.push(`$orderby=${orderBy}`)
  if (expand) queryParams.push(`$expand=${expand}`)
  return fetchDataverseApi<DataverseResponse<DataverseSeason>>(
    "ss_seasons",
    queryParams.join("&"),
  )
}

// --- LadderConfig table ---
export async function fetchDataverseLadderConfigs(
  filters?: string,
  select: string = "*",
  orderBy: string = "ss_name asc",
  expand: string = "ss_laddergroupconfig_ladderconfigid_ss_ladderconfig($select=ss_filtercondition,ss_filters,ss_headings,ss_label,_ss_ladderconfigid_value,ss_placingcategories)",
) {
  const queryParams = []
  if (select) queryParams.push(`$select=${select}`)
  if (filters) queryParams.push(`$filter=${filters}`)
  if (orderBy) queryParams.push(`$orderby=${orderBy}`)
  if (expand) queryParams.push(`$expand=${expand}`)
  return fetchDataverseApi<DataverseResponse<DataverseLadderConfig>>(
    "ss_ladderconfigs",
    queryParams.join("&"),
  )
}

// --- PlayoffPictureConfig table ---
export async function fetchDataversePlayoffPictureConfigs(
  filters?: string,
  select: string = "*",
  orderBy: string = "ss_name asc",
  expand: string = "",
) {
  const queryParams = []
  if (select) queryParams.push(`$select=${select}`)
  if (filters) queryParams.push(`$filter=${filters}`)
  if (orderBy) queryParams.push(`$orderby=${orderBy}`)
  if (expand) queryParams.push(`$expand=${expand}`)
  return fetchDataverseApi<DataverseResponse<DataversePlayoffPictureConfig>>(
    "ss_playoffpictureconfigs",
    queryParams.join("&"),
  )
}

// --- TVConfig table ---
export async function fetchDataverseTVConfigs(
  filters?: string,
  select: string = "*",
  orderBy: string = "ss_name asc",
  expand: string = "",
) {
  const queryParams = []
  if (select) queryParams.push(`$select=${select}`)
  if (filters) queryParams.push(`$filter=${filters}`)
  if (orderBy) queryParams.push(`$orderby=${orderBy}`)
  if (expand) queryParams.push(`$expand=${expand}`)
  return fetchDataverseApi<DataverseResponse<DataverseTVConfig>>(
    "ss_tvconfigs",
    queryParams.join("&"),
  )
}
