import fallback from "@/../public/vercel.svg";
import { AussieRulesGameQuarter } from "@/types/aussie-rules";
import Image from "next/image";

export default function AussieRulesScoreBreakdown({
  quarterData,
  homeLogo,
  awayLogo,
}: {
  quarterData: AussieRulesGameQuarter[];
  homeLogo?: string;
  awayLogo?: string;
}) {
  return (
    <table className="m-4 text-center dark:text-neutral-400">
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
            <Image
              src={homeLogo ?? fallback}
              width={15}
              height={15}
              alt="Home Logo"
            />
          </td>
          {quarterData.map((item) => (
            <td key={item.quarter}>
              {item.teams.home.goals
                ? `${item.teams.home.goals}.${item.teams.home.behinds}`
                : item.teams.home.points}
            </td>
          ))}
        </tr>
        <tr>
          <td>
            <Image
              src={awayLogo ?? fallback}
              width={15}
              height={15}
              alt="Away Logo"
            />
          </td>
          {quarterData.map((item) => (
            <td key={item.quarter}>
              {item.teams.away.goals
                ? `${item.teams.away.goals}.${item.teams.away.behinds}`
                : item.teams.away.points}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
