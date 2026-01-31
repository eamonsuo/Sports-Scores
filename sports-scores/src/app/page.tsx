"use client";

import EventCardGrid from "@/components/event-calendar/EventCardGrid";
import RegularSeasonsView from "@/components/event-calendar/RegularSeasonsView";
import { upcomingAndCurrentEvents } from "@/lib/constants";
import { getUpcomingEvents } from "@/services/event-calendar.service";
import { clsx } from "clsx";
import { useState } from "react";

type ViewMode = "major" | "regular";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("major");
  const adjustedDate = new Date();
  adjustedDate.setDate(adjustedDate.getDate() - 10);

  const upcomingEvents = getUpcomingEvents(
    upcomingAndCurrentEvents,
    adjustedDate,
  );

  const majorEvents = upcomingEvents.filter((e) => e.type === "major");
  const regularSeasons = upcomingEvents.filter(
    (e) => e.type === "regular-season",
  );

  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-600 dark:text-neutral-200">
            Events Calendar
          </h1>
          {/* <p className="text-gray-600 dark:text-neutral-400">
          Upcoming major events and ongoing seasons across all sports
        </p> */}
        </div>

        {/* View Mode Selector */}
        <div className="mb-4 flex rounded-lg bg-gray-200 p-1 dark:bg-neutral-800">
          <button
            onClick={() => setViewMode("major")}
            className={clsx(
              "flex-1 place-content-center rounded-md px-2 py-2 text-center focus:relative",
              viewMode === "major"
                ? "bg-white text-black shadow-sm dark:bg-neutral-600 dark:text-neutral-200"
                : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200",
            )}
          >
            🏆 Major Events
          </button>
          <button
            onClick={() => setViewMode("regular")}
            className={clsx(
              "flex-1 place-content-center rounded-md px-2 py-2 text-center focus:relative",
              viewMode === "regular"
                ? "bg-white text-black shadow-sm dark:bg-neutral-600 dark:text-neutral-200"
                : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200",
            )}
          >
            📅 Leagues
          </button>
        </div>
      </div>

      {/* Content */}

      {viewMode === "major" && <EventCardGrid events={majorEvents} />}
      {viewMode === "regular" && <RegularSeasonsView events={regularSeasons} />}
    </div>
  );
}
