import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type FootballScoreBreakdown = {
  teams: { home: { score: number }; away: { score: number } };
  periodName: string;
};

export default function NRLScoreBreakdown({
  scoreData,
  homeLogo,
  awayLogo,
}: {
  scoreData: FootballScoreBreakdown[];
  homeLogo?: string;
  awayLogo?: string;
}) {
  let ETFLAG = false;
  if (scoreData.length > 2) {
    ETFLAG = true;
  } else {
    scoreData = scoreData.slice(0, 2);
  }

  return (
    <table className="m-4 text-center dark:text-neutral-400">
      <thead>
        <tr>
          <th></th>
          <th>1st Half</th>
          <th>2nd Half</th>
          {ETFLAG && <th>Extra Time</th>}
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
