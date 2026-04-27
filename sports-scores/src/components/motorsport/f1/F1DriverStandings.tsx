import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type F1DriverStandings = {
  position: number;
  driver: { id: number; name: string; img?: string; teamimg?: string };
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
                <div className="flex items-center">
                  <Image
                    src={item.driver.img ?? fallback}
                    height={50}
                    width={50}
                    style={{ width: "20px", height: "auto" }}
                    alt={"Logo"}
                    className="me-2"
                  />
                  <Image
                    src={item.driver.teamimg ?? fallback}
                    height={40}
                    width={40}
                    style={{ width: "15px", height: "auto" }}
                    alt={"Team Logo"}
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
