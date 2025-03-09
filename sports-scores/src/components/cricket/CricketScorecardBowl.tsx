import { getCricketImageUrl } from "@/lib/projUtils";
import Image from "next/image";

export type CricketScorecardBowlProps = {
  overs: number;
  runs: number;
  wickets: number;
  economy: number;
  image?: string;
  name: string;
}[];

export default async function CricketScorecardBowl({
  data,
}: {
  data: CricketScorecardBowlProps;
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
          <tr key={item.name} className="border">
            <td className="ps-2">{data.indexOf(item) + 1}</td>
            <td className="flex gap-2 py-2 text-left">
              <Image
                src={getCricketImageUrl(item.image)}
                alt=""
                width={10}
                height={10}
              ></Image>{" "}
              {item.name}
            </td>
            <td>{item.overs}</td>
            <td>{item.runs}</td>
            <td>{item.wickets}</td>
            <td>{item.economy.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
