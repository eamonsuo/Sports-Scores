import { FALLBACK_IMAGE } from "@/lib/constants"
import { resolveSportImage } from "@/lib/imageMapping"
import { formatTime } from "@/lib/projUtils"
import { cn } from "@/lib/utils"
import { MatchStatus, MatchSummary } from "@/types/misc"
import Image from "next/image"
import Link from "next/link"
import Timer from "../misc-ui/Timer"

export default function SessionSummaryCard({
  event,
  href,
  className,
}: {
  event: MatchSummary
  href: string
  className?: string
}) {
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
          "mt-4 flex flex-col gap-1 border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-400 dark:active:bg-neutral-700",
          className,
        )}
      >
        <div className="flex gap-2">
          <div className="flex flex-1 flex-col gap-1">
            {event.competitorDetails.length > 0 ? (
              event.competitorDetails.map((c, idx) => (
                <div key={idx} className="flex flex-1 items-center gap-2">
                  <p>
                    {idx + 1 === 1
                      ? "🥇"
                      : idx + 1 === 2
                        ? "🥈"
                        : idx + 1 === 3
                          ? "🥉"
                          : idx + 1}
                  </p>
                  {Array.isArray(c?.img) ? (
                    <div className="flex">
                      {c.img.map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          width={100}
                          height={100}
                          style={{ width: "auto", height: "12px" }}
                          alt={`${c.name} player ${idx + 1}`}
                          className="me-0.5"
                        />
                      ))}
                    </div>
                  ) : (
                    c?.img && (
                      <Image
                        src={c.img}
                        width={80}
                        height={80}
                        style={{ width: "auto", height: "12px" }}
                        alt={c?.name ?? "Player"}
                      />
                    )
                  )}
                  <p className="flex-1 text-sm dark:text-neutral-500">
                    {" "}
                    {c.name}
                  </p>
                </div>
              ))
            ) : (
              <p className="flex-1">{event.summaryText}</p>
            )}
          </div>
          {event.status !== MatchStatus.COMPLETED &&
            event.tv?.map((tv, idx) => (
              <Image
                key={idx}
                src={resolveSportImage(tv.channel) || FALLBACK_IMAGE}
                width={100}
                height={100}
                style={{ width: "auto", height: "12px" }}
                alt={tv.channel}
                className="my-auto me-2"
              />
            ))}
          <Timer display={timer.display} displayColour={timer.displayColour} />
          <p>&gt;</p>
        </div>
      </div>
    </Link>
  )
}
