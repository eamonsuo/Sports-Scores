import {
  createDataverseMatchSummary,
  fetchDataverseMatchSummaries,
  updateDataverseMatchSummary,
} from "@/endpoints/dataverse.api";
import { DataverseMatchSummary } from "@/types/dataverse";
import {
  DeepPartial,
  MatchStatus,
  MatchSummary,
  SPORT,
  TeamScoreDetails,
} from "@/types/misc";

// --- MatchSummary Utilities ---

const STATUS_MAP: Record<0 | 1 | 2, MatchStatus> = {
  0: "LIVE",
  1: "UPCOMING",
  2: "COMPLETED",
};

const COLOUR_MAP: Record<0 | 1 | 2, "green" | "yellow" | "gray"> = {
  0: "green",
  1: "yellow",
  2: "gray",
};

const STATUS_REVERSE: Record<MatchStatus, 0 | 1 | 2> = {
  LIVE: 0,
  UPCOMING: 1,
  COMPLETED: 2,
};

const COLOUR_REVERSE: Record<"green" | "yellow" | "gray", 0 | 1 | 2> = {
  green: 0,
  yellow: 1,
  gray: 2,
};

function stringifyField(value: string | string[] | undefined): string | null {
  if (value === undefined || value === null) return null;
  return Array.isArray(value) ? JSON.stringify(value) : value;
}

function parseJsonField(value: string | null): string | string[] {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : String(parsed);
  } catch {
    return value;
  }
}

function mapToMatchSummary(r: DataverseMatchSummary): MatchSummary {
  const homeDetails: TeamScoreDetails = {
    name: r.ss_homename ?? "",
    score: parseJsonField(r.ss_homescore),
    img: r.ss_homeimg ? parseJsonField(r.ss_homeimg) : undefined,
    winDrawLoss: r.ss_homewdl ?? undefined,
  };

  const awayDetails: TeamScoreDetails = {
    name: r.ss_awayname ?? "",
    score: parseJsonField(r.ss_awayscore),
    img: r.ss_awayimg ? parseJsonField(r.ss_awayimg) : undefined,
    winDrawLoss: r.ss_awaywdl ?? undefined,
  };

  return {
    id: r.ss_matchid ?? "",
    startDate: new Date(r.ss_startdate ?? ""),
    endDate: r.ss_enddate ? new Date(r.ss_enddate) : undefined,
    sport: r.ss_sport ?? "",
    venue: r.ss_venue ?? undefined,
    status: r.ss_status != null ? STATUS_MAP[r.ss_status] : "UPCOMING",
    summaryText: r.ss_summarytext,
    otherDetail: r.ss_otherdetail ?? undefined,
    homeDetails,
    awayDetails,
    roundLabel: r.ss_roundlabel ?? undefined,
    timer:
      r.ss_status === 1
        ? new Date(r.ss_timer ?? "")
        : (r.ss_timer ?? undefined),
    timerDisplayColour:
      r.ss_timerdisplaycolour != null
        ? COLOUR_MAP[r.ss_timerdisplaycolour]
        : undefined,
    seriesName: r.ss_seriesname ?? undefined,
    matchSlug: r.ss_matchslug ?? undefined,
    seriesSlug: r.ss_seriesslug ?? undefined,
    winner: r.ss_winner ?? undefined,
    tournamentId: r.ss_tournamentid ?? undefined,
    seasonId: r.ss_seasonid ?? undefined,
    dataverseGUID: r.ss_matchsummaryid,
  };
}

export function mapToDataverseMatchSummary(
  m: MatchSummary,
): Omit<DataverseMatchSummary, "ss_matchsummaryid"> {
  return {
    ss_summarytext: m.summaryText,
    ss_matchid: m.id.toString(),
    ss_startdate: m.startDate.toISOString(),
    ss_enddate: m.endDate?.toISOString() ?? null,
    ss_sport: m.sport,
    ss_venue: m.venue ?? null,
    ss_status: STATUS_REVERSE[m.status],
    ss_otherdetail: m.otherDetail ?? null,
    ss_homename: m.homeDetails.name,
    ss_homescore: stringifyField(m.homeDetails.score),
    ss_homeimg: stringifyField(m.homeDetails.img),
    ss_homewdl: m.homeDetails.winDrawLoss ?? null,
    ss_awayname: m.awayDetails.name,
    ss_awayscore: stringifyField(m.awayDetails.score),
    ss_awayimg: stringifyField(m.awayDetails.img),
    ss_awaywdl: m.awayDetails.winDrawLoss ?? null,
    ss_roundlabel: m.roundLabel ?? null,
    ss_timer:
      m.timer instanceof Date ? m.timer.toISOString() : (m.timer ?? null),
    ss_timerdisplaycolour:
      m.timerDisplayColour != null
        ? COLOUR_REVERSE[m.timerDisplayColour]
        : null,
    ss_seriesname: m.seriesName ?? null,
    ss_matchslug: m.matchSlug ?? null,
    ss_seriesslug: m.seriesSlug ?? null,
    ss_winner: m.winner ?? null,
    ss_tournamentid: m.tournamentId ?? null,
    ss_seasonid: m.seasonId ?? null,
  };
}

// --- MatchSummary Services ---

export async function matchSummariesAll(): Promise<MatchSummary[] | null> {
  const response = await fetchDataverseMatchSummaries();
  if (!response) return null;
  return response.value.map(mapToMatchSummary);
}

export async function matchSummariesByTournament(
  tournamentId: number,
  seasonId: number,
  sport: SPORT,
): Promise<MatchSummary[] | null> {
  const filters = [
    `ss_tournamentid eq '${tournamentId}'`,
    `ss_seasonid eq '${seasonId}'`,
    `ss_sport eq '${sport}'`,
  ];
  const response = await fetchDataverseMatchSummaries(filters.join(" and "));
  if (!response) return null;
  return response.value.map(mapToMatchSummary);
}

export async function matchSummaryCreate(record: MatchSummary) {
  return createDataverseMatchSummary(mapToDataverseMatchSummary(record));
}

export async function matchSummaryUpdate(
  id: string,
  record: DeepPartial<MatchSummary>,
) {
  const mapped = mapToDataverseMatchSummary(record as MatchSummary);
  const partial = Object.fromEntries(
    Object.entries(mapped).filter(([, v]) => v !== null),
  ) as Partial<Omit<DataverseMatchSummary, "ss_matchsummaryid">>;
  return updateDataverseMatchSummary(id, partial);
}
