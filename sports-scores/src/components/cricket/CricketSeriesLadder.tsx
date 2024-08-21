import { getCricketImageUrl } from "@/lib/utils";
import { CricketStandings } from "@/types/cricket";
import Image from "next/image";

export default function CricketSeriesLadder({
  data,
}: {
  data: CricketStandings;
}) {
  return data.groups.map((group) => (
    <div key={group.name}>
      <p className="pb-1 pt-6 dark:text-neutral-400">{group.name}</p>

      <table className="w-full dark:text-neutral-400">
        <thead>
          <tr>
            <th className="pe-2"></th>
            <th className="px-2">Team</th>
            <th className="px-2">P</th>
            <th className="px-2">W</th>
            <th className="px-2">L</th>
            <th className="px-2">NRR</th>
            <th className="px-2">Pts</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {group.teamStats.map((item) => (
            <tr key={item.teamInfo.id} className="border">
              <td className="py-2 pe-2">{item.rank}</td>
              <td className="text-left text-sm">
                <div className="flex">
                  <Image
                    src={getCricketImageUrl(item.teamInfo.imageUrl)}
                    height={15}
                    width={15}
                    alt={"Logo"}
                    className="me-2"
                  />
                  {` ${item.teamInfo.name}`}
                </div>
              </td>
              <td>{item.matchesPlayed}</td>
              <td>{item.matchesWon}</td>
              <td>{item.matchesLost}</td>
              <td>{item.nrr}</td>
              <td>{item.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ));
}
