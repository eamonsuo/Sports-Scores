import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type TennisScoreBreakdown = {
  teams: { home: { score: number }; away: { score: number } };
  periodName: string;
};

export default function TennisScoreBreakdown({
  scoreData,
  homeLogo,
  awayLogo,
}: {
  scoreData: TennisScoreBreakdown[];
  homeLogo?: string;
  awayLogo?: string;
}) {
  const getSetLabel = (index: number) => {};

  return (
    <table className="m-4 text-center dark:text-neutral-400">
      <thead>
        <tr>
          <th></th>
          {scoreData.map((item, index) => (
            <th key={item.periodName}>{item.periodName}</th>
          ))}
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
