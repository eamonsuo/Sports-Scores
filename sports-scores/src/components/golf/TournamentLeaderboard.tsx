import { PlayerRow } from "@/types/golf";
import GolfPlayerImage from "./GolfPlayerImage";

export default function TournamentLeaderboard({
  players,
}: {
  players: PlayerRow[];
}) {
  return (
    <div className="">
      <table className="mb-2 w-full dark:text-neutral-400">
        <thead>
          <tr>
            <th className="pe-2">Pos</th>
            <th className="px-2"></th>
            <th className="text-left">Name</th>
            <th className="px-2">Total</th>
            <th className="px-2">Thru</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {players.map((item, index) => (
            <tr key={index} className="border">
              <td className="py-2">{item.scoringData.position}</td>
              <td className="pe-2">
                <GolfPlayerImage country={item.player.country} />
              </td>
              <td className="text-left">{item.player.displayName}</td>
              <td>{item.scoringData.total}</td>
              <td>{item.scoringData.thru}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
