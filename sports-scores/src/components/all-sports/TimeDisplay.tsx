"use client";

import { formatTime } from "@/lib/projUtils";

/**
 * Client-side time display component.
 * Formats times in the user's browser timezone automatically.
 */
export function TimeDisplay({
  date,
}: {
  date: Date | number | null | undefined;
}) {
  const timeStr = formatTime(date);
  if (!timeStr) return null;

  return <span>{timeStr}</span>;
}
