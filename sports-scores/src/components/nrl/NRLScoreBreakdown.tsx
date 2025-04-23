import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type NRLScoreBreakdown = {
  teams: { home: { score: number }; away: { score: number } };
  periodName: string;
};

export default function NRLScoreBreakdown({
  scoreData,
  homeLogo,
  awayLogo,
}: {
  scoreData: NRLScoreBreakdown[];
  homeLogo?: string;
  awayLogo?: string;
}) {
  return (
    <table className="m-4 text-center dark:text-neutral-400">
      <thead>
        <tr>
          <th></th>
          <th>1st Half</th>
          <th>2nd Half</th>
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
