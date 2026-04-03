/**
 * One-time script to create the MatchSummary table in Dataverse.
 *
 * Run from the sports-scores directory:
 *   npx tsx scripts/create-match-summary-table.ts
 *
 * Change PREFIX below if your Dataverse publisher prefix is not "new".
 */

import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const ENVIRONMENT_URL = process.env.DATAVERSE_ENVIRONMENT_URL ?? "";
const TENANT_ID = process.env.DATAVERSE_TENANT_ID ?? "";
const CLIENT_ID = process.env.DATAVERSE_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET ?? "";

const PREFIX = "ss"; // ← Change to your publisher prefix if needed
const TABLE_SCHEMA = `${PREFIX}_matchsummary`;

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
  if (!res.ok)
    throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.access_token as string;
}

// ---------------------------------------------------------------------------
// Dataverse Web API helpers
// ---------------------------------------------------------------------------

async function dvPost(token: string, path: string, body: unknown) {
  return fetch(`${ENVIRONMENT_URL}/api/data/v9.2/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
    },
    body: JSON.stringify(body),
  });
}

// ---------------------------------------------------------------------------
// Metadata builders
// ---------------------------------------------------------------------------

function label(text: string) {
  return { LocalizedLabels: [{ Label: text, LanguageCode: 1033 }] };
}

function str(
  schemaName: string,
  displayName: string,
  maxLength: number,
  required = false,
) {
  return {
    "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
    SchemaName: schemaName,
    DisplayName: label(displayName),
    RequiredLevel: { Value: required ? "ApplicationRequired" : "None" },
    MaxLength: maxLength,
    FormatName: { Value: "Text" },
  };
}

function memo(schemaName: string, displayName: string) {
  return {
    "@odata.type": "Microsoft.Dynamics.CRM.MemoAttributeMetadata",
    SchemaName: schemaName,
    DisplayName: label(displayName),
    RequiredLevel: { Value: "None" },
    MaxLength: 2000,
    Format: "TextArea",
  };
}

function integer(schemaName: string, displayName: string, required = false) {
  return {
    "@odata.type": "Microsoft.Dynamics.CRM.IntegerAttributeMetadata",
    SchemaName: schemaName,
    DisplayName: label(displayName),
    RequiredLevel: { Value: required ? "ApplicationRequired" : "None" },
    Format: "None",
    MinValue: -2147483648,
    MaxValue: 2147483647,
  };
}

function dateTime(schemaName: string, displayName: string, required = false) {
  return {
    "@odata.type": "Microsoft.Dynamics.CRM.DateTimeAttributeMetadata",
    SchemaName: schemaName,
    DisplayName: label(displayName),
    RequiredLevel: { Value: required ? "ApplicationRequired" : "None" },
    Format: "DateAndTime",
    DateTimeBehavior: { Value: "UserLocal" },
  };
}

function picklist(
  schemaName: string,
  displayName: string,
  options: { label: string; value: number }[],
) {
  return {
    "@odata.type": "Microsoft.Dynamics.CRM.PicklistAttributeMetadata",
    SchemaName: schemaName,
    DisplayName: label(displayName),
    RequiredLevel: { Value: "None" },
    OptionSet: {
      "@odata.type": "Microsoft.Dynamics.CRM.OptionSetMetadata",
      IsGlobal: false,
      OptionSetType: "Picklist",
      Options: options.map((o) => ({ Value: o.value, Label: label(o.label) })),
    },
  };
}

// ---------------------------------------------------------------------------
// Column definitions — mapped from MatchSummary & TeamScoreDetails
//
// NOTE: arrays (img, score) are stored as JSON strings.
//       timer is stored as a string (it can be string | Date in TypeScript).
// ---------------------------------------------------------------------------

const ATTRIBUTES = [
  // Match identity
  integer(`${PREFIX}_matchid`, "Match ID"),
  dateTime(`${PREFIX}_startdate`, "Start Date"),
  dateTime(`${PREFIX}_enddate`, "End Date"),
  str(`${PREFIX}_sport`, "Sport", 100),
  str(`${PREFIX}_venue`, "Venue", 200),
  picklist(`${PREFIX}_status`, "Status", [
    { label: "LIVE", value: 0 },
    { label: "UPCOMING", value: 1 },
    { label: "COMPLETED", value: 2 },
  ]),
  str(`${PREFIX}_otherdetail`, "Other Detail", 1000),

  // Home team (TeamScoreDetails)
  str(`${PREFIX}_homename`, "Home Team Name", 200),
  str(`${PREFIX}_homescore`, "Home Score", 500), // JSON — supports string | string[]
  str(`${PREFIX}_homeimg`, "Home Team Image", 1000), // JSON — supports string | string[]
  str(`${PREFIX}_homewdl`, "Home Win/Draw/Loss", 20),

  // Away team (TeamScoreDetails)
  str(`${PREFIX}_awayname`, "Away Team Name", 200),
  str(`${PREFIX}_awayscore`, "Away Score", 500),
  str(`${PREFIX}_awayimg`, "Away Team Image", 1000),
  str(`${PREFIX}_awaywdl`, "Away Win/Draw/Loss", 20),

  // Additional match details
  str(`${PREFIX}_roundlabel`, "Round Label", 200),
  str(`${PREFIX}_timer`, "Timer", 100), // string | Date stored as string
  picklist(`${PREFIX}_timerdisplaycolour`, "Timer Display Colour", [
    { label: "Green", value: 0 },
    { label: "Yellow", value: 1 },
    { label: "Gray", value: 2 },
  ]),
  str(`${PREFIX}_seriesname`, "Series Name", 200),
  str(`${PREFIX}_matchslug`, "Match Slug", 500),
  str(`${PREFIX}_seriesslug`, "Series Slug", 500),
  integer(`${PREFIX}_winner`, "Winner"),
  integer(`${PREFIX}_tournamentid`, "Tournament ID"),
  integer(`${PREFIX}_seasonid`, "Season ID"),
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!ENVIRONMENT_URL || !TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    console.error(
      "Missing Dataverse environment variables. Check your .env.local file.",
    );
    process.exit(1);
  }

  console.log("Acquiring access token...");
  const token = await getAccessToken();
  console.log("Token acquired.\n");

  // 1. Create the entity with its primary name attribute
  console.log(`Creating table: ${TABLE_SCHEMA}...`);
  const entityRes = await dvPost(token, "EntityDefinitions", {
    "@odata.type": "Microsoft.Dynamics.CRM.EntityMetadata",
    SchemaName: TABLE_SCHEMA,
    DisplayName: label("Match Summary"),
    DisplayCollectionName: label("Match Summaries"),
    Description: label("Sports match summary data"),
    HasActivities: false,
    HasNotes: false,
    OwnershipType: "OrganizationOwned",
    PrimaryNameAttribute: `${PREFIX}_summarytext`,
    Attributes: [
      {
        "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
        SchemaName: `${PREFIX}_summarytext`,
        DisplayName: label("Summary Text"),
        RequiredLevel: { Value: "ApplicationRequired" },
        MaxLength: 500,
        FormatName: { Value: "Text" },
        IsPrimaryName: true,
      },
    ],
  });

  if (!entityRes.ok) {
    const text = await entityRes.text();
    console.error(`✗ Failed to create table: ${entityRes.status}\n${text}`);
    process.exit(1);
  }
  console.log(`✓ Table created: ${TABLE_SCHEMA}\n`);

  // 2. Add remaining columns
  console.log("Adding columns...");
  let failures = 0;
  for (const attribute of ATTRIBUTES) {
    const res = await dvPost(
      token,
      `EntityDefinitions(LogicalName='${TABLE_SCHEMA}')/Attributes`,
      attribute,
    );
    if (!res.ok) {
      const text = await res.text();
      console.error(`  ✗ ${attribute.SchemaName}: ${res.status} — ${text}`);
      failures++;
    } else {
      console.log(`  ✓ ${attribute.SchemaName}`);
    }
  }

  // 3. Publish customizations
  console.log("\nPublishing customizations...");
  const publishRes = await dvPost(token, "PublishAllXml", {});
  if (!publishRes.ok) {
    console.warn(`⚠ Publish step failed: ${publishRes.status}`);
  } else {
    console.log("✓ Published.");
  }

  if (failures > 0) {
    console.warn(
      `\nDone with ${failures} column failure(s). Review errors above.`,
    );
  } else {
    console.log(`\nAll done! Table '${TABLE_SCHEMA}' is ready.`);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
