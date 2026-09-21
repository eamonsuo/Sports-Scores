import EventsCalendarClient from "@/components/event-calendar/EventsCalendarClient"
import { sportEventSchedulesActive } from "@/services/dataverse.service"

export const revalidate = 3600

export default async function Home() {
  const upcomingEvents = await sportEventSchedulesActive()

  if (!upcomingEvents || upcomingEvents.length === 0) {
    throw new Error(
      "No sport events returned from Dataverse — preserving stale cache",
    )
  }

  const majorEvents = upcomingEvents.filter((e) => e.type === "major")
  const regularSeasons = upcomingEvents.filter(
    (e) => e.type === "regular-season",
  )

  return (
    <EventsCalendarClient
      majorEvents={majorEvents}
      regularSeasons={regularSeasons}
    />
  )
}
