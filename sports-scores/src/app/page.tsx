import EventsCalendarClient from "@/components/event-calendar/EventsCalendarClient";
import { getUpcomingEvents } from "@/services/event-calendar.service";

export const revalidate = 3600;

export default async function Home() {
  const adjustedDate = new Date();
  adjustedDate.setDate(adjustedDate.getDate() - 5);

  const upcomingEvents = await getUpcomingEvents(adjustedDate);

  if (upcomingEvents.length === 0) {
    throw new Error(
      "No sport events returned from Dataverse — preserving stale cache",
    );
  }

  const majorEvents = upcomingEvents.filter((e) => e.type === "major");
  const regularSeasons = upcomingEvents.filter(
    (e) => e.type === "regular-season",
  );

  return (
    <EventsCalendarClient
      majorEvents={majorEvents}
      regularSeasons={regularSeasons}
    />
  );
}
