import fallback from "@/../public/vercel.svg";
import { formatTime } from "@/lib/projUtils";
import { cn } from "@/lib/utils";
import { MatchSummary } from "@/types/misc";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import Timer from "../misc-ui/Timer";

export default function MatchSummaryCard({
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
          "mt-4 flex flex-col items-center justify-center border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:active:bg-neutral-700",
          className,
        )}
      >
        <p className="text-center text-gray-500 dark:text-neutral-500">
          {matchSummary}
        </p>

        <div className="m-2 grid w-full grid-cols-5 gap-2">
          <div className="content-center justify-self-start">
            <Image
              src={homeDetails?.img ?? fallback}
              width={100}
              height={100}
              style={{ width: "40px", height: "auto" }}
              alt="Home team image"
            />
          </div>
          <p
            className={clsx(
              "content-center dark:text-neutral-400",
              winner === 1 && "font-bold",
            )}
          >
            {homeDetails?.score}
          </p>
          <div className="flex items-center justify-center overflow-visible">
            {timer.display && (
              <Timer
                display={timer.display}
                displayColour={timer.displayColour}
              />
            )}
          </div>

          <p
            className={clsx(
              "content-center text-right dark:text-neutral-400",
              winner !== 1 && winner !== undefined && "font-bold",
            )}
          >
            {awayDetails?.score}
          </p>
          <div className="content-center justify-self-end">
            <Image
              src={awayDetails?.img ?? fallback}
              width={100}
              height={100}
              style={{ width: "40px", height: "auto" }}
              alt="Away team image"
            />
          </div>
          <p
            className={clsx(
              "col-span-2 text-left text-xs text-gray-700 dark:text-neutral-500",
              winner === 1 && "font-bold",
            )}
          >
            {homeDetails?.name} <br /> {homeDetails?.winDrawLoss}
          </p>
          <div></div>
          <p
            className={clsx(
              "col-span-2 text-right text-xs text-gray-700 dark:text-neutral-500",
              winner !== 1 && winner !== undefined && "font-bold",
            )}
          >
            {awayDetails?.name} <br /> {awayDetails?.winDrawLoss}
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-neutral-500">
          {otherDetail}
        </p>
        <p className="text-center text-xs text-gray-500 dark:text-neutral-500">
          {venue}
        </p>
      </div>
    </Link>
  );
}
