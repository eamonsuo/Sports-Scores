import fallback from "@/../public/vercel.svg";
import { AFLStanding } from "@/types/afl";
import Image from "next/image";

export default function AFLLadder({ data }: { data: AFLStanding[] }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 dark:text-neutral-400">
      <table className="w-full">
        <thead>
          <tr>
            <th className="pe-2"></th>
            <th className="px-2">Team</th>
            <th className="px-2">P</th>
            <th className="px-2">W</th>
            <th className="px-2">%</th>
            <th className="px-2">Pts</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item) => (
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
              <td>{item.games.played}</td>
              <td>{item.games.win}</td>
              <td>
                {((item.scores.for / item.scores.against) * 100).toFixed(2)}
              </td>
              <td>{item.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
