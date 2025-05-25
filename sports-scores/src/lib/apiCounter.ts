import { SPORT } from "@/types/misc";

interface ApiQuotaInfo {
  percentUsed: number;
  lastUpdated?: Date;
  resetDate?: Date;
}

// Global variable to store quota info across requests
declare global {
  var aflApiQuota: ApiQuotaInfo | null;
  var nrlApiQuota: ApiQuotaInfo | null;
  var nflApiQuota: ApiQuotaInfo | null;
  var cricketApiQuota: ApiQuotaInfo | null;
  var golfApiQuota: ApiQuotaInfo | null;
}

if (!globalThis.aflApiQuota) {
  globalThis.aflApiQuota = null;
}

export function getGlobalApiQuota(sport: SPORT): ApiQuotaInfo | null {
  switch (sport) {
    case SPORT.AFL:
      return globalThis.aflApiQuota;
    case SPORT.NRL:
      return globalThis.nrlApiQuota;
    case SPORT.NFL:
      return globalThis.nflApiQuota;
    case SPORT.CRICKET:
      return globalThis.cricketApiQuota;
    case SPORT.GOLF:
      return globalThis.golfApiQuota;
    default:
      return null;
  }
}

export function updateGlobalApiQuota(
  requestsRemaining: number,
  requestsLimit: number,
  sport: SPORT,
): void {
  let percentUsed = Math.round((1 - requestsRemaining / requestsLimit) * 100);

  switch (sport) {
    case SPORT.AFL:
      globalThis.aflApiQuota = {
        percentUsed,
      };
    case SPORT.NRL:
      globalThis.nrlApiQuota = {
        percentUsed,
      };
    case SPORT.NFL:
      globalThis.nflApiQuota = {
        percentUsed,
      };
    case SPORT.CRICKET:
      globalThis.cricketApiQuota = {
        percentUsed,
      };
    case SPORT.GOLF:
      globalThis.golfApiQuota = {
        percentUsed,
      };
  }
}
