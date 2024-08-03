import { InningBatsman } from "@/types/cricket";

export default async function CricketScorecardBat({
  data,
}: {
  data: InningBatsman[];
}) {
  return (
    <table className="w-full flex-1 dark:text-neutral-400">
      <thead>
        <tr>
          <th className="pe-2">Player</th>
          <th className="px-2">Runs</th>
          <th className="px-2">Balls</th>
          <th className="px-2">SR</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {data.map((item) => (
          <tr key={item.player.battingName} className="border">
            <td className="py-2">{item.player.name}</td>
            <td>{item.runs}</td>
            <td>{item.balls}</td>
            <td>{item.strikerate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
