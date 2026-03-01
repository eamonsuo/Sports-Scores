import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type AmericanFootballScoreBreakdown = {
  teams: { home: { score: number }; away: { score: number } };
  periodName: string;
};

export default function AmericanFootballScoreBreakdown({
  scoreData,
  homeLogo,
  awayLogo,
}: {
  scoreData: AmericanFootballScoreBreakdown[];
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

  let OTFLAG = false;
  if (scoreData.length > 4) {
    OTFLAG = true;
  } else {
    scoreData = scoreData.slice(0, 4);
  }
  return (
    <table className="m-4 text-center dark:text-neutral-400">
      <thead>
        <tr>
          <th></th>
          <th>Q1</th>
          <th>Q2</th>
          <th>Q3</th>
          <th>Q4</th>
          {OTFLAG && <th>OT</th>}
          <th>Total</th>
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
          <td>
            {scoreData.reduce(
              (accumulator, current) => accumulator + current.teams.home.score,
              0,
            )}
          </td>
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
          <td>
            {scoreData.reduce(
              (accumulator, current) => accumulator + current.teams.away.score,
              0,
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
