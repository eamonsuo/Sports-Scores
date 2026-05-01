/**
 * Uploads events from non-Sofascore sources to the Dataverse ss_matchsummary table.
 * Each sport (or sub-sport) has its own adapter that fetches and maps data to MatchSummary[].
 *
 * Run from the sports-scores directory:
 *   npx tsx scripts/upload-custom-events.ts <sport> <sub-sport> [...args]
 *
 * Examples:
 *   npx tsx scripts/upload-custom-events.ts motorsport f1 2025
 *   npx tsx scripts/upload-custom-events.ts motorsport supercars 2025
 */

import { fetchF1Events } from "@/endpoints/f1.api";
import { mapToDataverseMatchSummary } from "@/services/dataverse.service";
import { DataverseMatchSummary } from "@/types/dataverse";
import { F1SessionType, Jolpica_Race } from "@/types/f1";
import { MatchStatus, MatchSummary, SPORT } from "@/types/misc";
import { loadEnvConfig } from "@next/env";
import { addHours } from "date-fns/addHours";

loadEnvConfig(process.cwd());

const ENVIRONMENT_URL = process.env.DATAVERSE_ENVIRONMENT_URL ?? "";
const TENANT_ID = process.env.DATAVERSE_TENANT_ID ?? "";
const CLIENT_ID = process.env.DATAVERSE_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET ?? "";

const TABLE = "ss_matchsummaries";
const CHUNK_SIZE = 100;

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const [, , sportArg, subSportArg, ...restArgs] = process.argv;
const sport = sportArg as SPORT;

if (!sportArg || !subSportArg) {
  console.error(
    "Usage: npx tsx scripts/upload-custom-events.ts <sport> <sub-sport> [...args]",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Adapter types
// ---------------------------------------------------------------------------

type EventAdapter = (args: string[]) => Promise<MatchSummary[]>;
type SubAdapterMap = Record<string, EventAdapter>;

// ---------------------------------------------------------------------------
// Motorsport adapters
// ---------------------------------------------------------------------------

function setSessionStatus(sessionDate: Date, sessionType: F1SessionType) {
  const currentDate = new Date();

  if (sessionDate > currentDate) {
    return MatchStatus.UPCOMING;
  } else {
    switch (sessionType) {
      case F1SessionType.Practice1:
      case F1SessionType.Practice2:
      case F1SessionType.Practice3:
        return sessionDate > addHours(currentDate, -1)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED;
      case F1SessionType.Qualifying:
      case F1SessionType.SprintQualifying:
      case F1SessionType.Sprint:
        return sessionDate > addHours(currentDate, -2)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED;
      case F1SessionType.Race:
        return sessionDate > addHours(currentDate, -3)
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED;
      default:
        return MatchStatus.COMPLETED;
    }
  }
}

function mapF1RaceToMatchSummaries(
  race: Jolpica_Race,
  season: string,
): MatchSummary[] {
  const sessions: MatchSummary[] = [];

  const mapSession = (
    sessionType: F1SessionType,
    dateStr: string,
    timeStr: string,
  ) => {
    const startDate = new Date(`${dateStr}T${timeStr}`);
    const status = setSessionStatus(startDate, sessionType);
    sessions.push({
      id: season + race.round + sessionType,
      sport: SPORT.MOTORSPORT,
      summaryText: sessionType.replace("-", " "),
      startDate,
      status,
      seriesName: race.raceName,
      seriesSlug: `f1/${season}`,
      matchSlug: `f1/${season}/${race.round}/${sessionType}`,
      roundLabel: `Round ${race.round}`,
      timer:
        status === MatchStatus.UPCOMING
          ? startDate
          : status.charAt(0) + status.slice(1).toLowerCase(),
      timerDisplayColour: status === MatchStatus.LIVE ? "green" : "gray",
      awayDetails: { score: "", name: "" },
      homeDetails: { score: "", name: "" },
      venue: race.Circuit.circuitName + ", " + race.Circuit.Location.locality,
      seasonId: season,
      tournamentId: "f1",
    });
  };

  if (race.FirstPractice)
    mapSession(
      F1SessionType.Practice1,
      race.FirstPractice.date,
      race.FirstPractice.time,
    );
  if (race.SecondPractice)
    mapSession(
      F1SessionType.Practice2,
      race.SecondPractice.date,
      race.SecondPractice.time,
    );
  if (race.ThirdPractice)
    mapSession(
      F1SessionType.Practice3,
      race.ThirdPractice.date,
      race.ThirdPractice.time,
    );
  if (race.SprintQualifying)
    mapSession(
      F1SessionType.SprintQualifying,
      race.SprintQualifying.date,
      race.SprintQualifying.time,
    );
  if (race.Sprint)
    mapSession(F1SessionType.Sprint, race.Sprint.date, race.Sprint.time);
  if (race.Qualifying)
    mapSession(
      F1SessionType.Qualifying,
      race.Qualifying.date,
      race.Qualifying.time,
    );
  mapSession(F1SessionType.Race, race.date, race.time);

  return sessions;
}

async function fetchF1Adapter(args: string[]): Promise<MatchSummary[]> {
  const [season] = args;
  if (!season) {
    throw new Error("F1 adapter requires: <season> (e.g., 2025)");
  }

  const races = await fetchF1Events(season);
  if (!races) {
    console.log("No F1 races found.");
    return [];
  }

  return races.flatMap((race) => mapF1RaceToMatchSummaries(race, season));
}

async function fetchSupercarsAdapter(args: string[]): Promise<MatchSummary[]> {
  const [_season] = args;
  // TODO: Implement supercars scraping/fetching logic
  // For now, placeholder that returns empty
  console.log(
    "Supercars adapter not yet implemented. Add scraping logic here.",
  );
  return [];
}

const motorsportAdapters: SubAdapterMap = {
  f1: fetchF1Adapter,
  supercars: fetchSupercarsAdapter,
};

// ---------------------------------------------------------------------------
// Adapter registry
// ---------------------------------------------------------------------------

const adapterRegistry: Partial<Record<SPORT, SubAdapterMap>> = {
  [SPORT.MOTORSPORT]: motorsportAdapters,
};

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
// Fetch existing records from Dataverse (for dedup)
// ---------------------------------------------------------------------------

async function fetchExistingRecords(
  token: string,
  tournamentId: string,
  seasonId: string,
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
// Main
// ---------------------------------------------------------------------------

async function main() {
  const sportAdapters = adapterRegistry[sport];
  if (!sportAdapters) {
    console.error(`No adapters registered for sport: ${sportArg}`);
    process.exit(1);
  }

  const adapter = sportAdapters[subSportArg];
  if (!adapter) {
    const available = Object.keys(sportAdapters).join(", ");
    console.error(
      `No adapter for sub-sport "${subSportArg}" under "${sportArg}". Available: ${available}`,
    );
    process.exit(1);
  }

  console.log(`\nFetching ${sportArg}/${subSportArg} events...`);
  const matches = await adapter(restArgs);
  console.log(`Fetched ${matches.length} matches.`);

  if (matches.length === 0) {
    console.log("Nothing to upload.");
    return;
  }

  // Determine tournamentId/seasonId from first match for dedup query
  const tournamentId = matches[0].tournamentId ?? subSportArg;
  const seasonId = matches[0].seasonId ?? restArgs[0] ?? "unknown";

  const token = await getAccessToken();

  console.log("Checking for existing records in Dataverse...");
  const existingRecords = await fetchExistingRecords(
    token,
    tournamentId,
    seasonId,
  );
  console.log(`Found ${existingRecords.size} existing matches in Dataverse.`);

  const operations: BatchOperation[] = matches.map((m) => {
    const record = mapToDataverseMatchSummary(m);
    const dvId = existingRecords.get(m.id.toString());
    return dvId
      ? { method: "PATCH", dvId, record }
      : { method: "POST", record };
  });

  const createCount = operations.filter((o) => o.method === "POST").length;
  const updateCount = operations.filter((o) => o.method === "PATCH").length;
  console.log(`${createCount} to create, ${updateCount} to update.`);

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
