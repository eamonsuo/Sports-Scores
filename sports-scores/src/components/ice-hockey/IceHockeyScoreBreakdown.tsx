import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type IceHockeyScoreBreakdown = {
  teams: { home: { score: number }; away: { score: number } };
  periodName: string;
};

export default function IceHockeyScoreBreakdown({
  scoreData,
  homeLogo,
  awayLogo,
}: {
  scoreData: IceHockeyScoreBreakdown[];
  homeLogo?: string;
  awayLogo?: string;
}) {
  return (
    <table className="m-4 text-center dark:text-neutral-400">
      <thead>
        <tr>
          <th></th>
          <th>1st Period</th>
          <th>2nd Period</th>
          <th>3rd Period</th>
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
          {scoreData.map((item) => (
            <td key={item.periodName}>{item.teams.home.score}</td>
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
          {scoreData.map((item) => (
            <td key={item.periodName}>{item.teams.away.score}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
