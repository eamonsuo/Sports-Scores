import { fetchSportEvents } from "@/endpoints/dataverse.api";
import { SportEvent } from "@/types/event-calendar";

function mapToSportEvent(
  raw: import("@/types/dataverse").DataverseSportEvent,
): SportEvent {
  let tags: string[] | undefined;
  if (raw.ss_tags) {
    try {
      tags = JSON.parse(raw.ss_tags);
    } catch {
      tags = undefined;
    }
  }

  return {
    id: raw.ss_sporteventscheduleid,
    name: raw.ss_name ?? "",
    sport: raw.ss_sport ?? "",
    type: raw.ss_event_type === 100000001 ? "regular-season" : "major",
    startDate: new Date(raw.ss_start_date!),
    endDate: raw.ss_end_date ? new Date(raw.ss_end_date) : undefined,
    dateDisplay: raw.ss_date_display ?? undefined,
    imageUrl: raw.ss_image_url ?? undefined,
    link: raw.ss_link ?? undefined,
    location: raw.ss_location ?? undefined,
    tags,
    notes: raw.ss_notes ?? undefined,
  };
}

// Fetches all sport events from Dataverse and filters to upcoming/current
export async function getUpcomingEvents(
  fromDate: Date = new Date(),
): Promise<SportEvent[]> {
  const raw = await fetchSportEvents();
  if (!raw) {
    console.error(
      "[event-calendar] Failed to fetch sport events from Dataverse",
    );
    return [];
  }

  return raw
    .map(mapToSportEvent)
    .filter((event) => {
      const endDate = event.endDate
        ? new Date(event.endDate)
        : new Date(event.startDate);
      return endDate >= fromDate;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
}
