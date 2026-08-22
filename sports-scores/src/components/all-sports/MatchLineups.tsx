import { LineupPlayer, MatchLineup } from "@/types/misc"
import Image from "next/image"

export default function MatchLineups({
  matchLineups,
}: {
  matchLineups?: MatchLineup[]
}) {
  const [homeTeam, awayTeam] = matchLineups ?? []

  return (
    <div className="px-4">
      {homeTeam && awayTeam && (
        <>
          <LineupTable
            homeTeam={homeTeam.startingPlayers}
            awayTeam={awayTeam.startingPlayers}
            label="Team"
            homeTeamName={homeTeam.teamName}
            awayTeamName={awayTeam.teamName}
          />
          <LineupTable
            homeTeam={homeTeam.otherPlayers}
            awayTeam={awayTeam.otherPlayers}
            label="Reserves"
          />
          <LineupTable
            homeTeam={homeTeam.coaches}
            awayTeam={awayTeam.coaches}
            label="Coaches"
          />
        </>
      )}
    </div>
  )
}

export function LineupTable({
  homeTeam,
  awayTeam,
  label,
  homeTeamName,
  awayTeamName,
}: {
  homeTeam?: LineupPlayer[]
  awayTeam?: LineupPlayer[]
  label: string
  homeTeamName?: string
  awayTeamName?: string
}) {
  const maxPlayers = Math.max(homeTeam?.length ?? 0, awayTeam?.length ?? 0)

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="py-4 text-center">
        <h2 className="text-lg font-semibold text-neutral-200">{label}</h2>
        {homeTeamName && awayTeamName && (
          <div className="grid grid-cols-2 py-2 text-center text-xs text-neutral-300">
            <div>{homeTeamName}</div>
            <div>{awayTeamName}</div>
          </div>
        )}
      </div>

      {Array.from({ length: maxPlayers }).map((_, index) => {
        const leftPlayer = homeTeam?.[index]
        const rightPlayer = awayTeam?.[index]

        return (
          <div
            key={index}
            className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200 last:border-b-0"
          >
            <PlayerCell player={leftPlayer} />
            <PlayerCell player={rightPlayer} align="right" />
          </div>
        )
      })}
    </div>
  )
}

function PlayerCell({
  player,
  align = "left",
}: {
  player?: LineupPlayer
  align?: "left" | "right"
}) {
  const isRight = align === "right"

  if (!player) {
    return <div className="min-h-[80px]" />
  }

  return (
    <div
      className={`flex items-center gap-3 p-2 ${
        isRight ? "justify-end text-right" : ""
      }`}
    >
      {!isRight && player.img && (
        <Image
          src={player.img}
          alt={player.country ?? ""}
          width={100}
          height={100}
          style={{ width: "32px", height: "auto" }}
        />
      )}

      {isRight && player.overseasPlayer && (
        <div className="text-xs text-neutral-500">✈</div>
      )}

      <div>
        <div className="text-sm text-neutral-400">{player.name}</div>

        {player.position && (
          <div className="text-xs text-neutral-500">{player.position}</div>
        )}

        {player.playerNumber && (
          <div className="text-xs text-neutral-400">#{player.playerNumber}</div>
        )}
      </div>

      {!isRight && player.overseasPlayer && (
        <div className="text-xs text-neutral-500">✈</div>
      )}

      {isRight && player.img && (
        <Image
          src={player.img}
          alt={player.country ?? ""}
          width={100}
          height={100}
          style={{ width: "32px", height: "auto" }}
        />
      )}
    </div>
  )
}
