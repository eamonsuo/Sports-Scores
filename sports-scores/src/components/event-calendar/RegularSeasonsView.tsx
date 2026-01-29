"use client";

import { SportEvent } from "@/types/event-calendar";
import { useState } from "react";
import EventCard from "./EventCard";

interface RegularSeasonsViewProps {
  events: SportEvent[];
}

type SeasonViewMode = "by-sport" | "active-upcoming";

export default function RegularSeasonsView({
  events,
}: RegularSeasonsViewProps) {
  const [viewMode, setViewMode] = useState<SeasonViewMode>("active-upcoming");

  return (
    <>
      {/* Sub-filter for Regular Seasons */}
      <div className="mx-6 mb-4 flex justify-center gap-2 rounded-lg bg-gray-200 p-1 dark:bg-neutral-800">
        <button
          onClick={() => setViewMode("active-upcoming")}
          className={`flex-1 rounded-md px-4 py-2 transition-all ${
            viewMode === "active-upcoming"
              ? "bg-white text-black shadow-sm dark:bg-neutral-600 dark:text-neutral-200"
              : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          All Leagues
        </button>
        <button
          onClick={() => setViewMode("by-sport")}
          className={`flex-1 rounded-md px-4 py-2 transition-all ${
            viewMode === "by-sport"
              ? "bg-white text-black shadow-sm dark:bg-neutral-600 dark:text-neutral-200"
              : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          By Sport
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6">
        {viewMode === "active-upcoming" && (
          <ActiveUpcomingView events={events} />
        )}
        {viewMode === "by-sport" && <BySportView events={events} />}
      </div>
    </>
  );
}

function ActiveUpcomingView({ events }: { events: SportEvent[] }) {
  const now = new Date();

  // Separate active and upcoming
  const activeSeasons = events.filter((event) => {
    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : start;
    return now >= start && now <= end;
  });

  const upcomingSeasons = events.filter((event) => {
    const start = new Date(event.startDate);
    return now < start;
  });

  return (
    <div className="space-y-8">
      {/* Active Seasons */}
      {activeSeasons.length > 0 && (
        <div>
          <h2 className="sticky top-0 z-10 mb-4 flex items-center gap-2 bg-white pb-2 pt-2 text-2xl font-bold text-gray-900 dark:bg-neutral-950 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white dark:bg-green-600">
              <span className="text-sm">●</span>
            </span>
            Active Leagues
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeSeasons.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Seasons */}
      {upcomingSeasons.length > 0 && (
        <div>
          <h2 className="sticky top-0 z-10 mb-4 bg-white pb-2 pt-2 text-2xl font-bold text-gray-900 dark:bg-neutral-950 dark:text-white">
            Upcoming Leagues
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingSeasons.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="rounded-lg border border-gray-300 p-8 text-center dark:border-neutral-500">
          <p className="text-gray-500 dark:text-neutral-400">
            No regular seasons found
          </p>
        </div>
      )}
    </div>
  );
}

function BySportView({ events }: { events: SportEvent[] }) {
  // Group by sport
  const eventsBySport = events.reduce(
    (acc, event) => {
      if (!acc[event.sport]) {
        acc[event.sport] = [];
      }
      acc[event.sport].push(event);
      return acc;
    },
    {} as Record<string, SportEvent[]>,
  );

  // Sort events within each sport by start date
  Object.keys(eventsBySport).forEach((sport) => {
    eventsBySport[sport].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  });

  const sortedSports = Object.keys(eventsBySport).sort();

  return (
    <div className="space-y-8">
      {sortedSports.map((sport) => (
        <div key={sport}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            {sport}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventsBySport[sport].map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="rounded-lg border border-gray-300 p-8 text-center dark:border-neutral-500">
          <p className="text-gray-500 dark:text-neutral-400">
            No regular seasons found
          </p>
        </div>
      )}
    </div>
  );
}
