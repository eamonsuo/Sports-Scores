import { getCricketImageUrl } from "@/lib/projUtils";
import Image from "next/image";

export type CricketScorecardBatProps = {
  batters: {
    name: string;
    image?: string;
    runs: number;
    balls: number;
    strikeRate: number;
    dismissalText?: string;
  }[];
  total: number;
  overs: number;
  wickets: number;
  extras: {
    total: number;
    byes: number;
    legbyes: number;
    wides: number;
    noballs: number;
  };
};

export default async function CricketScorecardBat({
  data,
}: {
  data: CricketScorecardBatProps;
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
        {data.batters.map((item) => (
          <tr key={item.name} className="border">
            <td className="ps-2">{data.batters.indexOf(item) + 1}</td>
            <td className="flex gap-2 py-2 text-left">
              <Image
                src={getCricketImageUrl(item.image)}
                alt=""
                width={10}
                height={10}
              ></Image>
              <div className="flex flex-col">
                <p>{item.name}</p>
                <p className="text-xs">{item.dismissalText}</p>
              </div>
            </td>
            <td>{item.runs}</td>
            <td>{item.balls}</td>
            <td>{item.strikeRate}</td>
          </tr>
        ))}
        <tr>
          <td></td>
          <td className="pt-3 text-left">
            {`b ${data.extras.byes} lb ${data.extras.legbyes} w ${data.extras.wides} nb ${data.extras.noballs}`}
          </td>
          <td className="pt-3">{data.extras.total}</td>
        </tr>
        <tr>
          <td></td>
          <td className="py-3 text-left">Total</td>
          <td>{`${data.wickets}/${data.total}`}</td>
          <td>({data.overs})</td>
        </tr>
      </tbody>
    </table>
  );
}
