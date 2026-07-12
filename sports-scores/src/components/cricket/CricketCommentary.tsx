import { cn } from "@/lib/utils"
import { CricketInningIncident, CricketOverIncident } from "@/types/cricket"
import ComponentList from "../misc-ui/ComponentList"

export default function CricketCommentary({
  matchIncidents,
}: {
  matchIncidents: CricketInningIncident[]
}) {
  return (
    <ComponentList
      labels={matchIncidents.map((item) => item.inningLabel)}
      curItem={matchIncidents[matchIncidents.length - 1].inningLabel}
    >
      {matchIncidents.map((inning) => (
        <div className="m-4 overflow-y-auto">
          {inning.inningIncidents
            .sort((a, b) => b.over - a.over)
            .map((over) => (
              <OverRow key={over.over} over={over} />
            ))}
        </div>
      ))}
    </ComponentList>
  )
}

type OverRowProps = {
  over: CricketOverIncident
}

function OverRow({ over }: OverRowProps) {
  return (
    <div className="grid grid-cols-[80px_1fr] border-t border-gray-400 text-sm">
      <div className="p-2">
        <div className="text-gray-400">Over {over.over}</div>
        <div className="mt-2 text-xs text-gray-500">{over.runs} Runs</div>
        <div className="text-xs text-gray-500">{over.teamScore}</div>
      </div>

      <div className="p-2">
        <div className="mb-0 text-gray-500">{over.bowlers.join(" & ")} to</div>
        <div className="mb-1 text-gray-500">{over.batters.join(" & ")}</div>

        <div className="mb-1 flex flex-wrap gap-2">
          {over.balls.map((ball, index) => (
            <BallChip key={`${over.over}-${index}`} value={ball} />
          ))}
        </div>
      </div>
    </div>
  )
}

type BallChipProps = {
  value: string
}

function BallChip({ value }: BallChipProps) {
  const upper = value.toUpperCase()

  const wicket = upper === "W"
  const four = upper === "4"
  const six = upper === "6"
  const extra =
    upper.includes("NB") ||
    upper.includes("WD") ||
    upper.includes("LB") ||
    upper.includes("B")

  return (
    <div
      className={cn(
        "flex h-5 min-w-5 items-center justify-center rounded px-1 text-sm font-semibold",
        {
          "bg-gray-100 text-gray-700": !wicket && !four && !six && !extra,
          "bg-red-500 text-white": wicket,
          "bg-blue-600 text-white": four,
          "bg-green-600 text-white": six,
          "bg-yellow-200 text-gray-700": extra,
        },
      )}
    >
      {value}
    </div>
  )
}
