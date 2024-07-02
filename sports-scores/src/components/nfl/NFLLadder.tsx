import Image from "next/image";

export default function NFLLadder({ data }: { data: NFLStanding[] }) {
  let splitData = data;
  let tables = [];

  while (splitData.length > 0) {
    let curDiv = splitData.splice(0, 4);
    tables.push(
      <div key={curDiv[0].division}>
        <p className="pb-1 pt-3">{curDiv[0].division}</p>

        <table className="w-full">
          <thead>
            <tr>
              <th className="pe-2"></th>
              <th className="px-2">Team</th>
              <th className="px-2">P</th>
              <th className="px-2">W</th>
              <th className="px-2">L</th>
              <th className="px-2">Form</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {curDiv.map((item) => (
              <tr key={item.team.id} className="border">
                <td className="py-2 pe-2">{item.position}</td>
                <td className="text-left text-sm">
                  <div className="flex">
                    <Image
                      src={item.team.logo}
                      height={10}
                      width={15}
                      alt={"Logo"}
                      className="me-2"
                    />
                    {` ${item.team.name}`}
                  </div>
                </td>
                <td>{item.won + item.lost + item.ties}</td>
                <td>{item.won}</td>
                <td>{item.lost}</td>
                <td>{item.streak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
  }

  return <div className="flex-1 overflow-y-auto px-4">{tables}</div>;
}
