import { F1SessionResults } from "@/types/f1";

export default function F1SessionResultsTable({
  data,
}: {
  data: F1SessionResults[];
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 dark:text-neutral-400">
      <table className="mb-2 w-full dark:text-neutral-400">
        <thead>
          <tr>
            <th className="pe-2">Pos</th>
            <th className="px-2">Driver</th>
            <th className="px-2">Grid</th>
            <th className="px-2">Gap</th>
            <th className="px-2">Pts</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item) => (
            <tr key={item.driver.id} className="border">
              <td className="py-2 pe-2">{item.position}</td>
              <td>{item.driver.name}</td>
              <td>{item.grid}</td>
              <td>{item.time}</td>
              <td>-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
