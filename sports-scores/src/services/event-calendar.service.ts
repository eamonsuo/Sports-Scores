import { upcomingAndCurrentEvents } from "@/lib/constants";
import { SportEvent } from "@/types/event-calendar";

// Helper function to get upcoming events
export function getUpcomingEvents(fromDate: Date = new Date()): SportEvent[] {
  const upcoming = upcomingAndCurrentEvents
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

  return upcoming;
}
