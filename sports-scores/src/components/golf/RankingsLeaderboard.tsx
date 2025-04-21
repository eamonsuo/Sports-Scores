import GolfPlayerImage from "./GolfPlayerImage";

export type GolfRankingsPlayerRow = {
  name: string;
  position: string;
  country: string;
  totalPoints: string;
  pointsBehind: string;
};

export default function RankingsLeaderboard({
  players,
  type,
}: {
  players: GolfRankingsPlayerRow[];
  type: "fedex" | "owgr";
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
            <th className="px-2">{type == "fedex" ? "Behind" : "Prev"}</th>
            {/* <th className="">Wins</th> */}
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
              <td>{item.totalPoints}</td>
              <td>{item.pointsBehind}</td>
              {/* <td>3</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
