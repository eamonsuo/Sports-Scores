import { SportEvent } from "@/types/event-calendar";

// Helper function to get upcoming events
export function getUpcomingEvents(
  events: SportEvent[],
  fromDate: Date = new Date(),
  limit?: number,
): SportEvent[] {
  const upcoming = events
    .filter((event) => {
      const endDate = event.endDate
        ? new Date(event.endDate)
        : new Date(event.startDate);
      // Include events that haven't ended yet (ongoing or upcoming)
      return endDate >= fromDate;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  return limit ? upcoming.slice(0, limit) : upcoming;
}
