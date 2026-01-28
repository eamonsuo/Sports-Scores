import { SportEvent } from "@/types/event-calendar";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: SportEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const EventWrapper = ({ children }: { children: React.ReactNode }) => {
    if (event.link) {
      return <Link href={event.link}>{children}</Link>;
    }
    if (event.externalLink) {
      return (
        <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return <div>{children}</div>;
  };

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

  return (
    <EventWrapper>
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
            <p>
              {format(new Date(event.startDate), "MMM dd, yyyy")}
              {event.endDate &&
                event.endDate !== event.startDate &&
                ` - ${format(new Date(event.endDate), "MMM dd, yyyy")}`}
            </p>
          </div>

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
    </EventWrapper>
  );
}
