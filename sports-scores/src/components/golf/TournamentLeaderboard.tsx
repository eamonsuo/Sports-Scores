import { FALLBACK_IMAGE } from "@/lib/constants"
import Image from "next/image"

export type GolfLeaderboardPlayerRow = {
  name: string
  position: string
  img?: string
  totalScore: string
  thru: string
  curRound: string
}

export default function TournamentLeaderboard({
  players,
}: {
  players: GolfLeaderboardPlayerRow[]
}) {
  return (
    <table className="mb-2 w-full dark:text-neutral-400">
      <thead>
        <tr>
          <th className="pe-2">Pos</th>
          <th className="px-2"></th>
          <th className="text-left">Name</th>

          <th className="px-2">Total</th>
          <th className="px-2">Rnd</th>
          <th className="px-2">Thru</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {players.map((item, index) => (
          <tr key={index} className="border">
            <td className="py-2">{item.position}</td>
            <td className="pe-2">
              <div className="flex items-center justify-center">
                <Image
                  src={item.img ?? FALLBACK_IMAGE}
                  height={60}
                  width={60}
                  style={{ width: "25px", height: "auto" }}
                  alt={`Flag`}
                />
              </div>
            </td>
            <td className="text-left">{item.name}</td>
            <td>{item.totalScore}</td>
            <td>{item.curRound}</td>
            <td>{item.thru}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
