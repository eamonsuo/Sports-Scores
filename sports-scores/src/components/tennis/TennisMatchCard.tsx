import fallback from "@/../public/vercel.svg";
import { formatTime } from "@/lib/projUtils";
import { cn } from "@/lib/utils";
import { MatchSummary } from "@/types/misc";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export default function TennisMatchCard({
  event,
  href,
  className,
}: {
  event: MatchSummary;
  href: string;
  className?: string;
}) {
  const {
    homeDetails,
    awayDetails,
    summaryText: matchSummary,
    otherDetail,
    venue,
    winner,
  } = event;
  const timer = {
    display:
      event.timer instanceof Date
        ? formatTime(event.timer)
        : (event.timer ?? ""),
    displayColour: event.timerDisplayColour,
  };
  return (
    <Link href={href}>
      <div
        className={cn(
          "mt-4 flex flex-col border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:active:bg-neutral-700",
          className,
        )}
      >
        {/* Match status/timer */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-neutral-500">
            {matchSummary}
          </p>
          <span
            className={clsx(
              "rounded px-2 py-0.5 text-xs",
              timer.displayColour === "green" &&
                "bg-green-500 text-neutral-200 dark:bg-green-700",
              timer.displayColour === "yellow" &&
                "bg-yellow-500 text-black dark:bg-yellow-600",
              timer.displayColour === "gray" &&
                "bg-gray-200 text-gray-700 dark:bg-neutral-700 dark:text-neutral-400",
            )}
          >
            {timer.display}
          </span>
        </div>

        {/* Players - Grid layout for tennis */}
        <div className="grid grid-cols-[1fr_auto] gap-2 border-gray-300 dark:border-neutral-600">
          {/* Home Player */}
          <div className="flex items-center gap-2">
            {Array.isArray(homeDetails?.img) ? (
              <div className="flex">
                {homeDetails.img.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img || fallback}
                    width={100}
                    height={100}
                    style={{ width: "32px", height: "auto" }}
                    alt={`${homeDetails.name} player ${idx + 1}`}
                    className="me-0.5"
                  />
                ))}
              </div>
            ) : (
              <Image
                src={homeDetails?.img || fallback}
                width={80}
                height={80}
                style={{ width: "32px", height: "auto" }}
                alt={homeDetails?.name ?? "Home player"}
              />
            )}
            <p
              className={clsx(
                "truncate text-sm text-gray-700 dark:text-neutral-500",
                winner === 1 && "font-bold",
              )}
            >
              {homeDetails?.name}
            </p>
          </div>
          <div className="flex divide-x divide-gray-300 dark:divide-neutral-600">
            {Array.isArray(homeDetails?.score) &&
              homeDetails.score.map((set, idx) => (
                <span
                  key={idx}
                  className="px-1 text-center dark:text-neutral-400"
                >
                  {set.split(" ").length > 1 ? (
                    <>
                      {set.split(" ")[0]}
                      <sup>{set.split(" ")[1]}</sup>
                    </>
                  ) : (
                    set
                  )}
                </span>
              ))}
          </div>

          {/* Away Player */}
          <div className="flex items-center gap-2">
            {Array.isArray(awayDetails?.img) ? (
              <div className="flex">
                {awayDetails.img.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img || fallback}
                    width={80}
                    height={80}
                    style={{ width: "32px", height: "auto" }}
                    alt={`${awayDetails.name} player ${idx + 1}`}
                    className="me-0.5"
                  />
                ))}
              </div>
            ) : (
              <Image
                src={awayDetails?.img || fallback}
                width={80}
                height={80}
                style={{ width: "32px", height: "auto" }}
                alt={awayDetails?.name ?? "Away player"}
              />
            )}
            <p
              className={clsx(
                "truncate text-sm text-gray-700 dark:text-neutral-500",
                winner !== 1 && winner !== undefined && "font-bold",
              )}
            >
              {awayDetails?.name}
            </p>
          </div>
          <div className="flex divide-x divide-gray-300 dark:divide-neutral-600">
            {Array.isArray(awayDetails?.score) &&
              awayDetails.score.map((set, idx) => (
                <span
                  key={idx}
                  className="px-1 text-center dark:text-neutral-400"
                >
                  {set.split(" ").length > 1 ? (
                    <>
                      {set.split(" ")[0]}
                      <sup>{set.split(" ")[1]}</sup>
                    </>
                  ) : (
                    set
                  )}
                </span>
              ))}
          </div>
        </div>

        {/* Footer Details */}
        {otherDetail && (
          <p className="mt-3 text-xs text-gray-500 dark:text-neutral-500">
            {otherDetail}
          </p>
        )}
        {venue && (
          <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
            {venue}
          </p>
        )}
      </div>
    </Link>
  );
}
