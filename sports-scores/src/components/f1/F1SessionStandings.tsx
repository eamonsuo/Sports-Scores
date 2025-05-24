export type F1SessionResults = {
  driver: { id: number; name: string };
  team: { name: string };
  position: number;
  time: string;
  laps?: number;
  grid?: string;
  pits?: number;
  gap?: string;
  points?: number;
};

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
            <th className="px-2">Gap</th>
            <th className="px-2">Pts</th>
            <th className="px-2">Grid</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item) => (
            <tr key={item.driver.id} className="border">
              <td className="py-2 pe-2">{item.position}</td>
              <td className="text-left">{item.driver.name}</td>
              <td>{item.time}</td>

              <td>{item.points}</td>
              <td>{item.grid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
