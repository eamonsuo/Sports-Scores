import { formatTime } from "@/lib/projUtils"
import { cn } from "@/lib/utils"
import { MatchSummary } from "@/types/misc"
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
          "mt-4 flex items-center gap-4 border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-400 dark:active:bg-neutral-700",
          className,
        )}
      >
        <p className="flex-1">{event.summaryText}</p>
        <Timer display={timer.display} displayColour={timer.displayColour} />
        <p>&gt;</p>
      </div>
    </Link>
  )
}
