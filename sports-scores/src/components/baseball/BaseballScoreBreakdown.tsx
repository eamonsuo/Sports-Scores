import fallback from "@/../public/vercel.svg";
import Image from "next/image";

export type BaseballScoreBreakdown = {
  teams: { home: { score: number }; away: { score: number } };
  inning: string;
};

export default function BaseballScoreBreakdown({
  scoreData,
  homeLogo,
  awayLogo,
}: {
  scoreData: BaseballScoreBreakdown[];
  homeLogo?: string;
  awayLogo?: string;
}) {
  let EXTRAFLAG = false;
  if (scoreData.length > 9) {
    EXTRAFLAG = true;
  } else {
    scoreData = scoreData.slice(0, 9);
  }
  return (
    <table className="m-4 text-center dark:text-neutral-400">
      <thead>
        <tr>
          <th></th>
          <th>1</th>
          <th>2</th>
          <th>3</th>
          <th>4</th>
          <th>5</th>
          <th>6</th>
          <th>7</th>
          <th>8</th>
          <th>9</th>
          {EXTRAFLAG && <th>10+</th>}
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
            <td key={item.inning}>{item.teams.home.score}</td>
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
            <td key={item.inning}>{item.teams.away.score}</td>
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
