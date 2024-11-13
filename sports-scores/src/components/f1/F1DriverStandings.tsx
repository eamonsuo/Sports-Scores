import { F1DriverStandings } from "@/types/f1";

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
              <td>{item.driver.name}</td>
              <td>{item.points ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
