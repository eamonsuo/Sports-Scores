import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type AmericanFootballStanding = {
  tableName: string;
  standings: AmericanFootballTeamStanding[];
};

export type AmericanFootballTeamStanding = {
  position: number;
  team: {
    id: number;
    name: string;
    logo?: string;
  };
  played: number;
  won: number;
  lost: number;
  ties: number;
  points: {
    for: number;
    against: number;
  };
};

export default function AmericanFootballLadder({
  data,
}: {
  data: AmericanFootballStanding;
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
            <th className="px-2">D</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.standings.map((item) => (
            <tr key={item.team.id} className="border">
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
              <td>{item.ties}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
