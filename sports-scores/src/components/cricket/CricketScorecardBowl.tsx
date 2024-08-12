import { getImageUrl } from "@/lib/utils";
import { InningBatsman, InningBowler } from "@/types/cricket";
import Image from "next/image";

export default async function CricketScorecardBowl({
  data,
}: {
  data: InningBowler[];
}) {
  return (
    <table className="w-full flex-1 dark:text-neutral-400">
      <thead>
        <tr>
          <th className="pe-2"></th>
          <th className="px-2">Player</th>
          <th className="px-2">O</th>
          <th className="px-2">R</th>
          <th className="px-2">W</th>
          <th className="px-2">ECON</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {data.map((item) => (
          <tr key={item.player.battingName} className="border">
            <td>{data.indexOf(item) + 1}</td>
            <td className="flex gap-2 py-2 text-left">
              <Image
                src={getImageUrl(item.player.headshotImageUrl)}
                alt=""
                width={30}
                height={30}
              ></Image>{" "}
              {item.player.name}
            </td>
            <td>{item.overs}</td>
            <td>{item.conceded}</td>
            <td>{item.wickets}</td>
            <td>{item.economy.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
