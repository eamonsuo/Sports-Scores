import { getCricketImageUrl } from "@/lib/projUtils";
import Image from "next/image";

export type CricketLadder = {
  name: string;
  teams: {
    name: string;
    logo?: string;
    rank: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    nrr: number;
    points: number;
  }[];
};

export default function CricketSeriesLadder({ data }: { data: CricketLadder }) {
  return (
    <div>
      <p className="pb-1 pt-6 dark:text-neutral-400">{data.name}</p>

      <table className="w-full dark:text-neutral-400">
        <thead>
          <tr>
            <th className="pe-2"></th>
            <th className="px-2">Team</th>
            <th className="px-2">P</th>
            <th className="px-2">W</th>
            <th className="px-2">D</th>
            <th className="px-2">L</th>
            <th className="px-2">NRR</th>
            <th className="px-2">Pts</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.teams.map((item) => (
            <tr key={item.rank} className="border">
              <td className="py-2 pe-2">{item.rank}</td>
              <td className="text-left text-sm">
                <div className="flex">
                  <Image
                    src={getCricketImageUrl(item.logo)}
                    height={15}
                    width={15}
                    alt={"Logo"}
                    className="me-2"
                  />
                  {` ${item.name}`}
                </div>
              </td>
              <td>{item.played}</td>
              <td>{item.won}</td>
              <td>{item.drawn}</td>
              <td>{item.lost}</td>
              <td>{item.nrr}</td>
              <td>{item.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
