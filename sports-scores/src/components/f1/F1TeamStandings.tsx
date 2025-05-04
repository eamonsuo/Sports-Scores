import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type F1TeamStandings = {
  position: number;
  team: { id: string; name: string; logo?: string };
  points: number;
};

export default function F1TeamStandingsTable({
  data,
}: {
  data: F1TeamStandings[];
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 dark:text-neutral-400">
      <table className="w-full">
        <thead>
          <tr>
            <th className="pe-2">Pos</th>
            <th className="px-2">Team</th>
            <th className="px-2">Pts</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item) => (
            <tr key={item.team.id} className="border">
              <td className="py-2 pe-2">{item.position}</td>
              <td className="text-left">
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
              <td>{item.points ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
