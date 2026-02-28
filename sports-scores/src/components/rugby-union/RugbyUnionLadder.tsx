import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type RugbyUnionStanding = {
  position: number;
  team: {
    id: number;
    name: string;
    logo?: string;
  };
  bonusPoints: number;
  points: number;
  games: {
    played: number;
    win: number;
    drawn: number;
    lost: number;
  };
  scores: {
    for: number;
    against: number;
  };
};

export default function RugbyUnionLadder({
  data,
  qualifyingPosition,
}: {
  data: RugbyUnionStanding[];
  qualifyingPosition: number;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 dark:text-neutral-400">
      <table className="w-full">
        <thead>
          <tr>
            <th className="pe-2"></th>
            <th className="px-1">Team</th>
            <th className="px-1">P</th>
            <th className="px-1">W</th>
            {/* <th className="px-1">D</th> */}
            <th className="px-1">L</th>
            <th className="px-1">Diff</th>
            <th className="px-1">BP</th>
            <th className="px-1">Pts</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item, idx) => (
            <tr
              key={item.team.id}
              className={`border ${idx === qualifyingPosition ? "border-t-4 border-t-red-600" : ""}`}
            >
              <td className="py-2 pe-2">{item.position}</td>
              <td className="text-left text-sm">
                <div className="flex">
                  <Image
                    src={item.team.logo ?? fallback}
                    height={10}
                    width={15}
                    alt={"Team Logo"}
                    className="me-2"
                  />
                  {item.team.name}
                </div>
              </td>
              <td>{item.games.played}</td>
              <td>{item.games.win}</td>
              {/* <td>{item.games.drawn}</td> */}
              <td>{item.games.lost}</td>
              <td>{item.scores.for - item.scores.against}</td>
              <td>{item.bonusPoints}</td>
              <td>{item.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
