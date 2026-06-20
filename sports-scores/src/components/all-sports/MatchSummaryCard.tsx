import { FALLBACK_IMAGE } from "@/lib/constants"
import { formatTime } from "@/lib/projUtils"
import { cn } from "@/lib/utils"
import { MatchSummary } from "@/types/misc"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import Timer from "../misc-ui/Timer"

export default function MatchSummaryCard({
  event,
  href,
  className,
}: {
  event: MatchSummary
  href: string
  className?: string
}) {
  const { competitorDetails, summaryText, otherDetail, venue, winner } = event

  const homeDetails = competitorDetails[0]
  const awayDetails = competitorDetails[1]

  const timer = {
    display:
      event.timer instanceof Date
        ? formatTime(event.timer)
        : (event.timer ?? ""),
    displayColour: event.timerDisplayColour,
  }

  return (
    <Link href={href}>
      <div
        className={cn(
          "mt-4 flex flex-col items-center justify-center border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:active:bg-neutral-700",
          className,
        )}
      >
        <p className="text-center text-gray-500 dark:text-neutral-500">
          {summaryText}
        </p>

        <div className="m-2 grid w-full grid-cols-5 gap-2">
          <div className="content-center justify-self-start">
            {Array.isArray(homeDetails?.img) ? (
              <div className="flex">
                {homeDetails.img.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img || FALLBACK_IMAGE}
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
                src={homeDetails?.img || FALLBACK_IMAGE}
                width={80}
                height={80}
                style={{ width: "32px", height: "auto" }}
                alt={homeDetails?.name ?? "Home player"}
              />
            )}
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
            {Array.isArray(awayDetails?.img) ? (
              <div className="flex">
                {awayDetails.img.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img || FALLBACK_IMAGE}
                    width={100}
                    height={100}
                    style={{ width: "32px", height: "auto" }}
                    alt={`${awayDetails.name} player ${idx + 1}`}
                    className="me-0.5"
                  />
                ))}
              </div>
            ) : (
              <Image
                src={awayDetails?.img || FALLBACK_IMAGE}
                width={80}
                height={80}
                style={{ width: "32px", height: "auto" }}
                alt={awayDetails?.name ?? "Away player"}
              />
            )}
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
  )
}
