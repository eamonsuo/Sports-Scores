import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type BasketballStanding = {
  tableName: string;
  standings: BasketballTeamStanding[];
};

export type BasketballTeamStanding = {
  position: number;
  team: {
    id: number;
    name: string;
    logo?: string;
  };
  played: number;
  won: number;
  lost: number;
  // ties: number;
  points: {
    for: number;
    against: number;
  };
  pct: number;
};

export default function BasketballLadder({
  data,
  qualifyingPosition,
}: {
  data: BasketballStanding;
  qualifyingPosition?: number;
}) {
  return (
    <div>
      <p className="pb-1 pt-3 dark:text-neutral-400">{data.tableName}</p>

      <table className="w-full dark:text-neutral-400">
        <thead>
          <tr>
            <th className="pe-2"></th>
            <th className="px-2">Team</th>
            <th className="px-2">P</th>
            <th className="px-2">W</th>
            <th className="px-2">L</th>
            {/* <th className="px-2">D</th> */}
            <th className="px-2">PCT</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.standings.map((item, idx) => (
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
                    alt={"Logo"}
                    className="me-2"
                  />
                  {item.team.name}
                </div>
              </td>
              <td>{item.played}</td>
              <td>{item.won}</td>
              <td>{item.lost}</td>
              {/* <td>{item.ties}</td> */}
              <td>{item.pct}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
