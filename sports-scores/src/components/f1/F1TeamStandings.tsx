export default function F1SessionResultsTable({
  data,
}: {
  data: F1TeamStandings[];
}) {
  return (
    <table className="w-full">
      <thead>
        <th className="pe-2">Pos</th>
        <th className="px-2">Team</th>
        <th className="px-2">Pts</th>
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
  );
}
