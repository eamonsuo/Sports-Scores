import GolfPlayerImage from "./GolfPlayerImage";

export type GolfLeaderboardPlayerRow = {
  name: string;
  position: string;
  country: string;
  totalScore: string;
  thru: string;
};

export default function TournamentLeaderboard({
  players,
}: {
  players: GolfLeaderboardPlayerRow[];
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
              <td className="py-2">{item.position}</td>
              <td className="pe-2">
                <GolfPlayerImage country={item.country} />
              </td>
              <td className="text-left">{item.name}</td>
              <td>{item.totalScore}</td>
              <td>{item.thru}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
