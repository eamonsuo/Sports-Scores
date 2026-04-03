/**
 * Fetches all historical rugby league matches for a given tournament/season
 * from the RugbyAPI and bulk-uploads them to the Dataverse ss_matchsummary table.
 *
 * Run from the sports-scores directory:
 *   npx tsx scripts/bulk-upload-rugby-league.ts <tournamentId> <seasonId>
 *
 * Example (NRL 2025):
 *   npx tsx scripts/bulk-upload-rugby-league.ts 294 63614
 */

import { fetchLastEvents, fetchNextEvents } from "@/endpoints/sofascore.api";
import { mapMatchSummary } from "@/lib/eventMapping";
import { mapToDataverseMatchSummary } from "@/services/dataverse.service";
import { DataverseMatchSummary } from "@/types/dataverse";
import { API_EVENT_TYPES, DISPLAY_TYPES, SPORT } from "@/types/misc";
import { Sofascore_Event } from "@/types/sofascore";
import { loadEnvConfig } from "@next/env";
import { format } from "date-fns/format";

loadEnvConfig(process.cwd());

const ENVIRONMENT_URL = process.env.DATAVERSE_ENVIRONMENT_URL ?? "";
const TENANT_ID = process.env.DATAVERSE_TENANT_ID ?? "";
const CLIENT_ID = process.env.DATAVERSE_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET ?? "";

const TABLE = "ss_matchsummaries";
const CHUNK_SIZE = 100;

const [, , tournamentIdArg, seasonIdArg, sportArg, displayTypeArg] =
  process.argv;
const tournamentId = tournamentIdArg;
const seasonId = seasonIdArg;
const sport = sportArg as SPORT;
const displayType = (displayTypeArg as DISPLAY_TYPES) ?? DISPLAY_TYPES.ROUND;

if (!tournamentId || !seasonId || !sport) {
  console.error(
    "Usage: npx tsx scripts/bulk-upload-sofascore-events.ts <tournamentId> <seasonId> <sport> <displayType?>",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

async function getAccessToken() {
  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: `${ENVIRONMENT_URL}/.default`,
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

// ---------------------------------------------------------------------------
// Rugby API types & fetch
// ---------------------------------------------------------------------------

async function fetchAllPages(label: string, fn: typeof fetchLastEvents) {
  const events: Sofascore_Event[] = [];
  let page = 0;
  while (true) {
    console.log(`Fetching ${label} events page ${page}...`);
    const data = await fn(Number(tournamentId), Number(seasonId), page);
    if (!data || data.events.length === 0) break;
    events.push(...data.events);
    if (!data.hasNextPage) break;
    page++;
  }
  console.log(`Fetched ${events.length} ${label} events in ${page + 1} pages.`);
  return events;
}

async function fetchAllRecords() {
  const [lastEvents, nextEvents] = await Promise.all([
    fetchAllPages("last", fetchLastEvents),
    fetchAllPages("next", fetchNextEvents),
  ]);

  return [...lastEvents, ...nextEvents];

  // Deduplicate by event ID if needed
  // const seenIds = new Set<number>();
  // const all: Sofascore_Event[] = [];
  // for (const event of [...lastEvents, ...nextEvents]) {
  //   if (!seenIds.has(event.id)) {
  //     seenIds.add(event.id);
  //     all.push(event);
  //   }
  // }
  // return all;
}

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

function mapEventToRecord(
  event: Sofascore_Event,
): Omit<DataverseMatchSummary, "ss_matchsummaryid"> {
  let roundLabel = "";
  switch (displayType) {
    case DISPLAY_TYPES.ROUND:
      roundLabel =
        event.roundInfo?.name ?? `Round ${event.roundInfo?.round ?? 0}`;
      break;
    case DISPLAY_TYPES.DATE:
      var startDate = new Date(0);
      startDate.setUTCSeconds(event.startTimestamp);
      roundLabel = format(startDate, "eee d MMM");
      break;
    // case DISPLAY_TYPES.LEAGUE:
    //   roundLabel = isMultiLeague
    //     ? (leagueConfig.find(
    //         (l) =>
    //           l.slug === event.tournament.uniqueTournament.id.toString(),
    //       )?.name ?? event.tournament.name)
    //     : event.tournament.name;
    //   break;
  }

  const matchSummary = mapMatchSummary(
    API_EVENT_TYPES.SOFASCORE,
    sport,
    event,
    { roundLabel, tournamentId, seasonId },
  );

  return mapToDataverseMatchSummary(matchSummary);
}

// ---------------------------------------------------------------------------
// $batch upload
// ---------------------------------------------------------------------------

type BatchOperation =
  | { method: "POST"; record: Omit<DataverseMatchSummary, "ss_matchsummaryid"> }
  | {
      method: "PATCH";
      dvId: string;
      record: Omit<DataverseMatchSummary, "ss_matchsummaryid">;
    };

function buildBatchBody(operations: BatchOperation[], boundary: string) {
  const baseUrl = `${ENVIRONMENT_URL}/api/data/v9.2/${TABLE}`;
  const parts = operations.map((op) => {
    const body = JSON.stringify(op.record);
    const contentLength = Buffer.byteLength(body, "utf8");
    const requestLine =
      op.method === "POST"
        ? `POST ${baseUrl} HTTP/1.1`
        : `PATCH ${baseUrl}(${op.dvId}) HTTP/1.1`;
    return [
      `--${boundary}`,
      "Content-Type: application/http",
      "Content-Transfer-Encoding: binary",
      "",
      requestLine,
      "Content-Type: application/json;odata.metadata=minimal",
      `Content-Length: ${contentLength}`,
      "Accept: application/json",
      "OData-MaxVersion: 4.0",
      "OData-Version: 4.0",
      "Prefer: return=minimal",
      ...(op.method === "PATCH" ? ["If-Match: *"] : []),
      "",
      body,
    ].join("\r\n");
  });
  return parts.join("\r\n") + `\r\n--${boundary}--`;
}

async function uploadBatch(token: string, operations: BatchOperation[]) {
  const boundary = `batch_${Date.now()}`;
  const body = buildBatchBody(operations, boundary);

  const res = await fetch(`${ENVIRONMENT_URL}/api/data/v9.2/$batch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/mixed; boundary=${boundary}`,
      Accept: "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
    },
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`Batch request failed: ${res.status}`, text);
    return 0;
  }

  return (text.match(/HTTP\/1\.1 204 No Content/g) ?? []).length;
}

// ---------------------------------------------------------------------------
// Fetch existing match IDs from Dataverse
// ---------------------------------------------------------------------------

// Returns Map<ss_matchid, ss_matchsummaryid (Dataverse GUID)>
async function fetchExistingRecords(
  token: string,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  let url: string | null =
    `${ENVIRONMENT_URL}/api/data/v9.2/${TABLE}` +
    `?$select=ss_matchid,ss_matchsummaryid` +
    `&$filter=ss_tournamentid eq '${tournamentId}' and ss_seasonid eq '${seasonId}' and ss_sport eq '${sport}'` +
    `&$top=5000`;

  while (url) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        Prefer: "odata.maxpagesize=5000",
      },
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch existing records: ${res.status} ${await res.text()}`,
      );
    }
    const data = (await res.json()) as {
      value: { ss_matchid: string; ss_matchsummaryid: string }[];
      "@odata.nextLink"?: string;
    };
    for (const row of data.value) {
      map.set(row.ss_matchid, row.ss_matchsummaryid);
    }
    url = data["@odata.nextLink"] ?? null;
  }

  return map;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(
    `\nBulk uploading ${sport} matches — tournament ${tournamentId}, season ${seasonId}`,
  );

  const token = await getAccessToken();

  console.log("Checking for existing records in Dataverse...");
  const existingRecords = await fetchExistingRecords(token);
  console.log(`Found ${existingRecords.size} existing matches in Dataverse.`);

  const events = await fetchAllRecords();
  console.log(`Fetched ${events.length} matches from API.`);

  const operations: BatchOperation[] = events.map((e) => {
    const record = mapEventToRecord(e);
    const dvId = existingRecords.get(e.id.toString());
    return dvId
      ? { method: "PATCH", dvId, record }
      : { method: "POST", record };
  });

  const createCount = operations.filter((o) => o.method === "POST").length;
  const updateCount = operations.filter((o) => o.method === "PATCH").length;
  console.log(`${createCount} to create, ${updateCount} to update.`);

  if (operations.length === 0) {
    console.log("Nothing to upload.");
    return;
  }

  const totalChunks = Math.ceil(operations.length / CHUNK_SIZE);
  let totalSuccess = 0;
  let totalFailed = 0;

  for (let i = 0; i < operations.length; i += CHUNK_SIZE) {
    const chunk = operations.slice(i, i + CHUNK_SIZE);
    const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
    console.log(
      `\nUploading chunk ${chunkNum}/${totalChunks} (${chunk.length} operations)...`,
    );

    const successes = await uploadBatch(token, chunk);
    const failures = chunk.length - successes;
    console.log(`  ✓ ${successes} succeeded, ✗ ${failures} failed`);

    totalSuccess += successes;
    totalFailed += failures;
  }

  console.log(
    `\nDone. Total: ${totalSuccess} succeeded, ${totalFailed} failed.`,
  );

  if (totalFailed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
