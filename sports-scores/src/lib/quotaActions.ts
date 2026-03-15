"use server";

import { getGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

/**
 * Server Action that fetches the current API quota usage for a given sport.
 * Called from the client-side APIStatus component to get up-to-date quota
 * values stored in server memory (globalThis).
 */
export async function getQuota(
  sport: SPORT,
): Promise<{ percentUsed: number } | null> {
  const quota = getGlobalApiQuota(sport);
  if (!quota) return null;
  return { percentUsed: quota.percentUsed };
}
