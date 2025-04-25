import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type NFLScoreBreakdown = {
  teams: { home: { score: number }; away: { score: number } };
  periodName: string;
};

export default function NFLScoreBreakdown({
  scoreData,
  homeLogo,
  awayLogo,
}: {
  scoreData: NFLScoreBreakdown[];
  homeLogo?: string;
  awayLogo?: string;
}) {
  let OTFLAG = false;
  // if (data.scores.home.overtime !== null) {
  //   OTFLAG = true;
  // }
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
              src={homeLogo ?? fallback}
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
              src={awayLogo ?? fallback}
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
