import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type F1DriverStandings = {
  position: number;
  driver: { id: number; name: string; img?: string };
  points: number;
  wins?: number;
};

export default function F1DriverStandingsTable({
  data,
}: {
  data: F1DriverStandings[];
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 dark:text-neutral-400">
      <table className="w-full">
        <thead>
          <tr>
            <th className="pe-2">Pos</th>
            <th className="px-2">Driver</th>
            <th className="px-2">Pts</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item) => (
            <tr key={item.driver.id} className="border">
              <td className="py-2 pe-2">{item.position}</td>
              <td className="text-left">
                <div className="flex">
                  <Image
                    src={item.driver.img ?? fallback}
                    height={20}
                    width={20}
                    alt={"Logo"}
                    className="me-2"
                  />
                  {item.driver.name}
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
