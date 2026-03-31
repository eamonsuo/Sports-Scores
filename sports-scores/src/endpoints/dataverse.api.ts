import {
  DataverseMatchSummary,
  DataverseResponse,
  DataverseSportEvent,
} from "@/types/dataverse";

const ENVIRONMENT_URL = process.env.DATAVERSE_ENVIRONMENT_URL ?? "";
const TENANT_ID = process.env.DATAVERSE_TENANT_ID ?? "";
const CLIENT_ID = process.env.DATAVERSE_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET ?? "";

// Module-scoped token cache
let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: `${ENVIRONMENT_URL}/.default`,
  });

  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      body,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `[Dataverse] Token request failed: ${res.status} ${res.statusText}`,
        errorBody,
      );
      return null;
    }

    const data = await res.json();
    cachedToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 300) * 1000,
    };

    return cachedToken.accessToken;
  } catch (error) {
    console.error("[Dataverse] Token request error:", error);
    return null;
  }
}

async function fetchDataverseApi(entity: string, queryParams?: string) {
  const token = await getAccessToken();
  if (!token) return null;

  const url = new URL(`${ENVIRONMENT_URL}/api/data/v9.2/${entity}`);
  if (queryParams) url.search = `?${queryParams}`;

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
    });

    if (!res.ok || res.status === 204) {
      const errorBody = await res.text();
      if (res.status === 401) {
        cachedToken = null;
      }
      console.error(
        `[Dataverse] API request failed: ${res.status} ${res.statusText} — ${entity}`,
        errorBody,
        res,
      );
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[Dataverse] API request error (${entity}):`, error);
    return null;
  }
}

async function createDataverseRecord(
  entity: string,
  record: Record<string, unknown>,
) {
  const token = await getAccessToken();
  if (!token) return null;

  const url = `${ENVIRONMENT_URL}/api/data/v9.2/${entity}`;

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
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `[Dataverse] Create failed: ${res.status} ${res.statusText} — ${entity}`,
        errorBody,
      );
      return null;
    }

    // Dataverse returns the new record ID in the OData-EntityId header
    const entityId = res.headers.get("OData-EntityId");
    const match = entityId?.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error(`[Dataverse] Create error (${entity}):`, error);
    return null;
  }
}

async function updateDataverseRecord(
  entity: string,
  id: string,
  record: Record<string, unknown>,
) {
  const token = await getAccessToken();
  if (!token) return false;

  const url = `${ENVIRONMENT_URL}/api/data/v9.2/${entity}(${id})`;

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
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `[Dataverse] Update failed: ${res.status} ${res.statusText} — ${entity}(${id})`,
        errorBody,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`[Dataverse] Update error (${entity}):`, error);
    return false;
  }
}

// --- MatchSummary table ---

export async function fetchDataverseMatchSummaries(
  filters?: string,
  select: string = "*",
  orderBy: string = "ss_startdate asc",
) {
  const queryParams = [];
  if (select) queryParams.push(`$select=${select}`);
  if (filters) queryParams.push(`$filter=${filters}`);
  if (orderBy) queryParams.push(`$orderby=${orderBy}`);
  return (await fetchDataverseApi(
    "ss_matchsummaries",
    queryParams.join("&"),
  )) as DataverseResponse<DataverseMatchSummary>;
}

export async function createDataverseMatchSummary(
  record: Omit<DataverseMatchSummary, "ss_matchsummaryid">,
) {
  return createDataverseRecord(
    "ss_matchsummaries",
    record as Record<string, unknown>,
  );
}

export async function updateDataverseMatchSummary(
  id: string,
  record: Partial<Omit<DataverseMatchSummary, "ss_matchsummaryid">>,
) {
  return updateDataverseRecord(
    "ss_matchsummaries",
    id,
    record as Record<string, unknown>,
  );
}

// --- SportEventSchedule table ---

export async function fetchSportEvents(): Promise<
  DataverseSportEvent[] | null
> {
  const result = (await fetchDataverseApi(
    "ss_sporteventschedules",
    "$orderby=ss_start_date asc",
  )) as DataverseResponse<DataverseSportEvent> | null;
  return result?.value ?? null;
}
