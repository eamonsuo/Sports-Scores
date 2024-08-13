import { getCricketImageUrl } from "@/lib/utils";
import { InningBatsman } from "@/types/cricket";
import Image from "next/image";

export default async function CricketScorecardBat({
  data,
}: {
  data: InningBatsman[];
}) {
  return (
    <table className="w-full flex-1 dark:text-neutral-400">
      <thead>
        <tr>
          <th className="pe-2"></th>
          <th className="px-2">Player</th>
          <th className="px-2">R</th>
          <th className="px-2">B</th>
          <th className="px-2">SR</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {data.map((item) => (
          <tr key={item.player.battingName} className="border">
            <td>{data.indexOf(item) + 1}</td>
            <td className="flex gap-2 py-2 text-left">
              <Image
                src={getCricketImageUrl(item.player.headshotImageUrl)}
                alt=""
                width={30}
                height={30}
              ></Image>{" "}
              <div className="flex flex-col">
                <p>{item.player.name}</p>{" "}
                <p className="text-xs">{item.dismissalText?.long}</p>
              </div>
            </td>
            <td>{item.runs}</td>
            <td>{item.balls}</td>
            <td>{item.strikerate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
