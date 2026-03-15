import { SPORT } from "@/types/misc";

interface ApiQuotaInfo {
  percentUsed: number;
  lastUpdated?: Date;
  resetDate?: Date;
}

// Global variable to store quota info across requests
declare global {
  var apiQuotas: Record<string, ApiQuotaInfo>;
}

if (!globalThis.apiQuotas) {
  globalThis.apiQuotas = {};
}

export const API_RESET_PERIOD: Partial<Record<SPORT, string>> = {
  [SPORT.CRICKET]: "per month",
  [SPORT.AUSSIE_RULES]: "per month",
  [SPORT.GOLF]: "per month",
  [SPORT.BASEBALL]: "per day",
  [SPORT.BASKETBALL]: "per day",
  [SPORT.FOOTBALL]: "per day",
  [SPORT.AMERICAN_FOOTBALL]: "per day",
  [SPORT.RUGBY_UNION]: "per day",
  [SPORT.RUGBY_LEAGUE]: "per day",
  [SPORT.ICE_HOCKEY]: "per day",
  [SPORT.NETBALL]: "per day",
  [SPORT.TENNIS]: "per day",
  [SPORT.CYCLING]: "per day",
};

export function getGlobalApiQuota(sport: SPORT): ApiQuotaInfo | null {
  return globalThis.apiQuotas[sport] ?? null;
}

export function updateGlobalApiQuota(
  requestsRemaining: number,
  requestsLimit: number,
  sport: SPORT,
): void {
  const percentUsed = Math.round((1 - requestsRemaining / requestsLimit) * 100);

  globalThis.apiQuotas[sport] = {
    percentUsed,
  };
}
