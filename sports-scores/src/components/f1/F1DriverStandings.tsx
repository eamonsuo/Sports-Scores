export default function F1DriverStandings({
  data,
}: {
  data: F1DriverStandings[];
}) {
  return (
    <table className="w-full">
      <thead>
        <th className="pe-2">Pos</th>
        <th className="px-2">Driver</th>
        <th className="px-2">Pts</th>
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
  );
}
