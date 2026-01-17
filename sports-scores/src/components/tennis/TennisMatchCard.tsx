import fallback from "@/../public/vercel.svg";
import { TeamScoreDetails } from "@/types/misc";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export default function TennisMatchCard({
  id,
  href,
  matchSummary,
  homeInfo,
  awayInfo,
  timer,
  venue,
  topInfo,
  bottomInfo,
  winner,
}: {
  id: number;
  href: string;
  matchSummary: string;
  homeInfo: TeamScoreDetails;
  awayInfo: TeamScoreDetails;
  timer: { display: string; displayColour?: "green" | "yellow" | "white" };
  venue: string;
  topInfo?: string;
  bottomInfo?: string;
  winner?: number;
}) {
  return (
    <Link href={href}>
      <div className="mt-4 flex flex-col rounded-md border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:active:bg-neutral-700">
        {/* Header with tournament/round info */}
        {topInfo && (
          <p className="mb-2 text-xs text-gray-700 dark:text-neutral-500">
            {topInfo}
          </p>
        )}

        {/* Match status/timer */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-neutral-500">
            {matchSummary}
          </p>
          <span
            className={clsx(
              "rounded px-2 py-0.5 text-xs",
              timer.displayColour === "green" &&
                "bg-green-500 text-white dark:bg-green-600",
              timer.displayColour === "yellow" &&
                "bg-yellow-500 text-black dark:bg-yellow-600",
              !timer.displayColour &&
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
            <Image
              src={homeInfo.img ?? fallback}
              width={32}
              height={32}
              alt={homeInfo.name}
            />
            <p
              className={clsx(
                "truncate text-sm text-gray-700 dark:text-neutral-500",
                winner === 1 && "font-bold",
              )}
            >
              {homeInfo.name}
            </p>
          </div>
          <div className="flex divide-x divide-gray-300 dark:divide-neutral-600">
            {Array.isArray(homeInfo.score) &&
              homeInfo.score.map((set, idx) => (
                <span
                  key={idx}
                  className="px-1 text-center dark:text-neutral-400"
                >
                  {set}
                </span>
              ))}
          </div>

          {/* Away Player */}
          <div className="flex items-center gap-2">
            <Image
              src={awayInfo.img ?? fallback}
              width={32}
              height={32}
              alt={awayInfo.name}
            />
            <p
              className={clsx(
                "truncate text-sm text-gray-700 dark:text-neutral-500",
                winner !== 1 && winner !== undefined && "font-bold",
              )}
            >
              {awayInfo.name}
            </p>
          </div>
          <div className="flex divide-x divide-gray-300 dark:divide-neutral-600">
            {Array.isArray(awayInfo.score) &&
              awayInfo.score.map((set, idx) => (
                <span
                  key={idx}
                  className="px-1 text-center dark:text-neutral-400"
                >
                  {set}
                </span>
              ))}
          </div>
        </div>

        {/* Footer info */}
        {bottomInfo && (
          <p className="mt-3 text-xs text-gray-500 dark:text-neutral-500">
            {bottomInfo}
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
