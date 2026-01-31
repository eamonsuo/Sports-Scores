import { SportEvent } from "@/types/event-calendar";
import { format, isSameDay } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: SportEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const isOngoing = event.endDate
    ? new Date() >= new Date(event.startDate) &&
      new Date() <= new Date(event.endDate)
    : false;

  // Calculate days until event starts
  const now = new Date();
  const startDate = new Date(event.startDate);
  const daysUntilStart = Math.ceil(
    (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const showCountdown = daysUntilStart > 0 && daysUntilStart < 10;

  // Determine date display
  const getDateDisplay = () => {
    // If custom dateDisplay is provided, use it
    if (event.dateDisplay) {
      return event.dateDisplay;
    }

    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : null;

    // If no end date or same day, show single date
    if (!end || isSameDay(start, end)) {
      return format(start, "d MMM yyyy");
    }

    // Check if start and end are in different years
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    if (startYear !== endYear) {
      // Different years - show year on both dates
      return `${format(start, "d MMM yyyy")} - ${format(end, "d MMM yyyy")}`;
    } else {
      // Same year - show year only on end date
      return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy")}`;
    }
  };

  return (
    <Link href={event.link ?? ""}>
      <div className="group flex h-full cursor-pointer overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition-all hover:shadow-md active:bg-gray-100 dark:border-neutral-500 dark:bg-neutral-800 dark:active:bg-neutral-700">
        {/* Image Section */}
        {event.imageUrl && (
          <div className="flex w-20 flex-shrink-0 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-2 dark:from-neutral-700 dark:to-neutral-800">
            <Image
              src={event.imageUrl}
              alt={event.name}
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 p-4">
          {/* Event Type Badge */}
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                event.type === "major"
                  ? "bg-yellow-500 text-black dark:bg-yellow-600"
                  : "bg-blue-500 text-white dark:bg-blue-800 dark:text-neutral-200"
              }`}
            >
              {event.sport}
            </span>
            {isOngoing && (
              <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-neutral-200 dark:bg-green-700">
                Live
              </span>
            )}
            {showCountdown && (
              <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-neutral-200 dark:bg-orange-700">
                {daysUntilStart}{" "}
                {daysUntilStart === 1 ? "day away" : "days away"}
              </span>
            )}
          </div>

          {/* Event Name */}
          <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-neutral-200">
            {event.name}
          </h3>

          {/* Date */}
          <div className="mb-2 text-sm text-gray-700 dark:text-neutral-300">
            <p>{getDateDisplay()}</p>
          </div>

          {/* Notes Section */}
          {event.notes && (
            <div className="mb-2 whitespace-pre-line rounded bg-blue-50 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              {event.notes}
            </div>
          )}

          {/* Location and Tags */}
          <div className="flex items-center justify-between gap-3">
            {event.location && (
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                📍 {event.location}
              </p>
            )}
            {event.tags && event.tags.length > 0 && (
              <div className="flex gap-1">
                {event.tags.map((tag, index) => (
                  <span key={index} className="text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
