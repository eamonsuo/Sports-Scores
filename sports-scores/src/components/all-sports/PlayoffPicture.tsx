"use client"
import { FALLBACK_IMAGE } from "@/lib/constants"
import type {
  PlayoffPictureGroup,
  PlayoffPictureTeam,
} from "@/types/playoff-picture"
import Image from "next/image"
import { useState } from "react"
import { Button } from "../misc-ui/Button"

const gridCols: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
}

function Matchup({
  home,
  away,
}: {
  home: PlayoffPictureTeam
  away: PlayoffPictureTeam
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <span className="w-4 text-right">{home.positionDisplay}</span>
      {home.logo && (
        <Image
          src={home.logo ?? FALLBACK_IMAGE}
          alt={"Team Logo"}
          width={80}
          height={80}
          style={{ width: "32px", height: "auto" }}
        />
      )}
      <span className="mx-2 text-xs text-gray-400">vs</span>
      {away.logo && (
        <Image
          src={away.logo ?? FALLBACK_IMAGE}
          alt={"Team Logo"}
          width={80}
          height={80}
          style={{ width: "32px", height: "auto" }}
        />
      )}
      <span className="w-4 text-left">{away.positionDisplay}</span>
    </div>
  )
}

export default function PlayoffPicture({
  data,
  buttonLabel,
}: {
  data: PlayoffPictureGroup[]
  buttonLabel?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-4 mb-2 flex-col overflow-y-auto">
      <div className="mb-2 flex justify-center">
        <Button
          variant="outline"
          className="rounded bg-neutral-600 px-4 py-2"
          onClick={() => setOpen((v) => !v)}
        >
          {buttonLabel ?? "Playoff Picture"}
        </Button>
      </div>
      {open && (
        <div
          className={`grid ${gridCols[data.length] ?? "grid-cols-1"} gap-6 rounded-lg border bg-gray-100 p-4 dark:bg-neutral-900`}
        >
          {data.map((conference, i) => (
            <div key={i}>
              <h3
                className={`mb-2 text-center text-lg ${conference.colour ?? "text-gray-700 dark:text-gray-300"}`}
              >
                {conference.name}
              </h3>
              {conference.conferenceMatches.map((section, j) => (
                <div key={j} className="mb-4">
                  <h4 className="text-center">{section.title}</h4>
                  {Array.isArray(section.teams[0])
                    ? (
                        section.teams as [
                          PlayoffPictureTeam,
                          PlayoffPictureTeam,
                        ][]
                      ).map(([home, away], k) => (
                        <Matchup key={k} home={home} away={away} />
                      ))
                    : Array.from({
                        length: Math.ceil(section.teams.length / 3),
                      }).map((_, rowIdx) => (
                        <div
                          key={rowIdx}
                          className="flex items-center justify-center gap-2 py-1"
                        >
                          {(section.teams as PlayoffPictureTeam[])
                            .slice(rowIdx * 3, rowIdx * 3 + 3)
                            .map((team) => (
                              <span key={team.id} className="flex items-center">
                                <Image
                                  src={team.logo ?? FALLBACK_IMAGE}
                                  alt={"Team Logo"}
                                  width={80}
                                  height={80}
                                  style={{ width: "32px", height: "auto" }}
                                />
                              </span>
                            ))}
                        </div>
                      ))}
                </div>
              ))}
            </div>
          ))}
          {/* <iframe
            src="https://en.wikipedia.org/wiki/2025_AFL_season#Finals_series"
            title="Playoff Picture"
            className="h-128 w-full"
          /> */}
        </div>
      )}
    </div>
  )
}
