import { AFLGameQuarters } from "@/types/afl";
import Image from "next/image";

export default function AFLScoreBreakdown({
  quarterData,
  homeLogo,
  awayLogo,
}: {
  quarterData: AFLGameQuarters;
  homeLogo: string;
  awayLogo: string;
}) {
  return (
    <table className="m-4 text-center">
      <thead>
        <tr>
          <th></th>
          <th>Q1</th>
          <th>Q2</th>
          <th>Q3</th>
          <th>Q4</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Image src={homeLogo} width={15} height={15} alt="Home Logo" />
          </td>
          {quarterData.quarters.map((item) => (
            <td key={item.quarter}>
              {item.teams.home.goals}.{item.teams.home.behinds}
            </td>
          ))}
        </tr>
        <tr>
          <td>
            <Image src={awayLogo} width={15} height={15} alt="Away Logo" />
          </td>
          {quarterData.quarters.map((item) => (
            <td key={item.quarter}>
              {item.teams.away.goals}.{item.teams.away.behinds}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
