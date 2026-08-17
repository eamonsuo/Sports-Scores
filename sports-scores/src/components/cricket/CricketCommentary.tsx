"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog"
import { cn } from "@/lib/shadcnUtils"
import {
  CricketBallIncident,
  CricketInningIncident,
  CricketOverIncident,
} from "@/types/cricket"
import ComponentList from "../misc-ui/ComponentList"

export default function CricketCommentary({
  matchIncidents,
}: {
  matchIncidents: CricketInningIncident[]
}) {
  console.log("CricketCommentary matchIncidents", matchIncidents)
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
    <Dialog>
      <DialogTrigger asChild>
        <div className="grid cursor-pointer grid-cols-[80px_1fr] border-t border-gray-400 text-sm">
          <div className="p-2">
            <div className="text-gray-400">Over {over.over}</div>
            <div className="mt-2 text-xs text-gray-500">{over.runs} Runs</div>
            <div className="text-xs text-gray-500">{over.teamScore}</div>
          </div>

          <div className="p-2">
            <div className="mb-0 text-gray-500">
              {over.bowlers.join(" & ")} to
            </div>
            <div className="mb-1 text-gray-500">{over.batters.join(" & ")}</div>

            <div className="mb-1 flex flex-wrap gap-2">
              {over.balls.map((ball, index) => (
                <BallChip key={`${over.over}-${index}`} value={ball.value} />
              ))}
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Over {over.over}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          <table className="w-full text-sm">
            <tbody>
              {over.balls.map((ball, index) => (
                <BallRow
                  key={`${over.over}-${ball.ball}-${index}`}
                  ball={ball}
                  over={over.over}
                />
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

type BallRowProps = {
  ball: CricketBallIncident
  over: number
}

function BallRow({ ball, over }: BallRowProps) {
  return (
    <tr className="border-t border-gray-200 align-top">
      <td className="w-10 px-1 py-2 text-xs text-gray-400">
        {over}.{ball.ball}
      </td>
      <td className="w-10 px-1 py-2">
        <BallChip value={ball.value} />
      </td>
      <td className="px-1 py-2 ps-2 text-gray-600">{ball.commentary}</td>
    </tr>
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
