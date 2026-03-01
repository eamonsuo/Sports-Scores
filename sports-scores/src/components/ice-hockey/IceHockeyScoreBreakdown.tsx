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
  homeLogo?: string | string[];
  awayLogo?: string | string[];
}) {
  // Use first image if array (for doubles), and handle empty strings
  const homeLogoSrc = Array.isArray(homeLogo)
    ? homeLogo[0] || undefined
    : homeLogo || undefined;
  const awayLogoSrc = Array.isArray(awayLogo)
    ? awayLogo[0] || undefined
    : awayLogo || undefined;

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
              src={homeLogoSrc ?? fallback}
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
              src={awayLogoSrc ?? fallback}
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
