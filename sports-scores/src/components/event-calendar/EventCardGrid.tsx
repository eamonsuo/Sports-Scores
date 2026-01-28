"use client";

import { SportEvent } from "@/types/event-calendar";
import { format } from "date-fns";
import EventCard from "./EventCard";

interface EventCardGridProps {
  events: SportEvent[];
}

export default function EventCardGrid({ events }: EventCardGridProps) {
  // Group events by month - events only appear in their starting month
  const eventsByMonth = events.reduce(
    (acc, event) => {
      const startDate = new Date(event.startDate);
      const monthKey = format(startDate, "MMMM yyyy");

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(event);

      return acc;
    },
    {} as Record<string, SportEvent[]>,
  );

  // Get current/upcoming events (ongoing or starting soon)
  const now = new Date();
  const currentEvents = events.filter((event) => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;
    // Only include ongoing events in the top section
    return now >= startDate && now <= endDate;
  });

  const monthKeys = Object.keys(eventsByMonth);

  // Scroll to month when clicked
  const scrollToMonth = (monthKey: string) => {
    const element = document.getElementById(`month-${monthKey}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Current/Upcoming Events Section */}
      {currentEvents.length > 0 && (
        <div className="mb-6">
          <h2 className="sticky top-0 z-10 mb-4 bg-white pb-2 pt-2 text-2xl font-bold text-gray-900 dark:bg-neutral-950 dark:text-neutral-200">
            Current Events
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentEvents.map((event) => (
              <EventCard key={`current-${event.id}`} event={event} />
            ))}
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 mb-6 bg-white dark:bg-neutral-950">
        <h2 className="pb-2 pt-2 text-2xl font-bold text-gray-900 dark:text-neutral-200">
          Calendar of Events
        </h2>
        {/* Month Selector */}
        {monthKeys.length > 0 && (
          <div className="pb-4">
            <div className="hideScroll flex gap-2 overflow-x-auto pb-2">
              {monthKeys.map((monthKey) => (
                <button
                  key={monthKey}
                  onClick={() => scrollToMonth(monthKey)}
                  className="whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition-all hover:bg-gray-50 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  {monthKey}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Events by Month */}

      {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
        <div key={month} id={`month-${month}`} className="mb-6 scroll-mt-24">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-neutral-200">
            {month}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {monthEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="rounded-lg border border-gray-300 p-8 text-center dark:border-neutral-500">
          <p className="text-gray-500 dark:text-neutral-400">
            No events found for this filter
          </p>
        </div>
      )}
    </div>
  );
}
