import { F1TeamStandings } from "@/types/f1";

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
              <td>{item.team.name}</td>
              <td>{item.points ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
