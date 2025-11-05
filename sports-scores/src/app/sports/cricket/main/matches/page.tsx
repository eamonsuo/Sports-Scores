"use client";
import CricketFixtureList from "@/components/cricket/CricketFixtureList";
import Placeholder from "@/components/misc/Placeholder";
import { cricketMatchesByDate } from "@/services/cricket.service";
import { MatchSummary } from "@/types/misc";
import { useEffect, useRef, useState } from "react";

export const dynamic = "force-dynamic";

export default function InfiniteCricketMatches() {
  const [mounted, setMounted] = useState(false);
  const [matchSummaries, setMatchSummaries] = useState<MatchSummary[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const currentDayRef = useRef<HTMLDivElement>(null);

  // Only run client logic after mount
  useEffect(() => {
    setMounted(true);
    if (dates.length === 0) {
      const today = new Date();
      setDates([today]);
      loadMatches([today], false, true); // Mark as initial load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMatches(
    dateList: Date[],
    prepend = false,
    isInitial = false,
  ) {
    setLoading(true);
    let allNewSummaries: MatchSummary[] = [];
    for (const date of dateList) {
      const result = await cricketMatchesByDate(date);
      if (result && result.length > 0) {
        allNewSummaries = [...allNewSummaries, ...result];
      }
    }
    setMatchSummaries((prev) => {
      // Filter out matches with duplicate IDs
      const existingIds = new Set(prev.map((m) => m.id));
      const uniqueNewSummaries = allNewSummaries.filter(
        (m) => !existingIds.has(m.id),
      );
      return prepend
        ? [...uniqueNewSummaries, ...prev]
        : [...prev, ...uniqueNewSummaries];
    });
    setLoading(false);
    setHasMore(allNewSummaries.length > 0);
    if (isInitial) setInitialLoadComplete(true);
  }

  // Infinite scroll removed; only button click loads more

  // Handler for loading next day (future) matches
  function handleLoadNext() {
    if (loading) return;
    const nextDate = new Date(dates[dates.length - 1]);
    nextDate.setDate(nextDate.getDate() + 1);
    setDates((prev) => [...prev, nextDate]);
    loadMatches([nextDate]);
  }

  // Backwards loading: load previous day when button is clicked
  function handleLoadPrevious() {
    if (loading) return;
    const prevDate = new Date(dates[0]);
    prevDate.setDate(prevDate.getDate() - 1);
    setDates((prev) => [prevDate, ...prev]);
    loadMatches([prevDate], true);
    // Scroll to the first record of the current day after loading
    setTimeout(() => {
      if (currentDayRef.current) {
        currentDayRef.current.scrollIntoView({
          behavior: "auto",
          inline: "center",
        });
      }
    }, 100);
  }

  if (!initialLoadComplete || (!mounted && loading)) {
    // Render a full-height loading placeholder until initial load is complete
    return (
      <div className="flex flex-1 items-center justify-center">
        <Placeholder>Loading...</Placeholder>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="m-4 flex justify-center">
        <button
          className={
            "rounded-md px-4 py-2 text-center transition-colors duration-150 focus:relative " +
            (loading
              ? "bg-gray-300 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"
              : "bg-gray-700 text-gray-400 hover:text-gray-700 active:bg-gray-300 active:text-black dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:active:bg-neutral-600 dark:active:text-neutral-100")
          }
          style={{ minWidth: "auto" }}
          onClick={handleLoadPrevious}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load previous day"}
        </button>
      </div>
      {/* Attach ref to the first record of the current day */}
      <div ref={currentDayRef} id="current-day-anchor" />

      <CricketFixtureList data={matchSummaries} />

      <div ref={loaderRef} className="m-4 flex items-center justify-center">
        <button
          className={
            "rounded-md px-4 py-2 text-center transition-colors duration-150 focus:relative " +
            (loading
              ? "bg-gray-300 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"
              : "bg-gray-700 text-gray-400 hover:text-gray-700 active:bg-gray-300 active:text-black dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:active:bg-neutral-600 dark:active:text-neutral-100")
          }
          style={{ minWidth: "auto" }}
          onClick={handleLoadNext}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load next day"}
        </button>
      </div>
    </div>
  );
}
