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
  homeLogo?: string | string[];
  awayLogo?: string | string[];
}) {
  // Use first image if array (for doubles tennis), and handle empty strings
  const homeLogoSrc = Array.isArray(homeLogo)
    ? homeLogo[0] || undefined
    : homeLogo || undefined;
  const awayLogoSrc = Array.isArray(awayLogo)
    ? awayLogo[0] || undefined
    : awayLogo || undefined;

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
            {Array.isArray(homeLogo) ? (
              <div className="flex -space-x-1">
                {homeLogo.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img || fallback}
                    width={15}
                    height={15}
                    alt={`Home player ${idx + 1}`}
                    className="rounded-full border border-white dark:border-neutral-800"
                  />
                ))}
              </div>
            ) : (
              <Image
                src={homeLogoSrc ?? fallback}
                width={15}
                height={15}
                alt="Home Logo"
              />
            )}
          </td>
          {scoreData.map((item) => (
            <td key={item.periodName}>{item.teams.home.score}</td>
          ))}
        </tr>
        <tr>
          <td>
            {Array.isArray(awayLogo) ? (
              <div className="flex -space-x-1">
                {awayLogo.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img || fallback}
                    width={15}
                    height={15}
                    alt={`Away player ${idx + 1}`}
                    className="rounded-full border border-white dark:border-neutral-800"
                  />
                ))}
              </div>
            ) : (
              <Image
                src={awayLogoSrc ?? fallback}
                width={15}
                height={15}
                alt="Away Logo"
              />
            )}
          </td>
          {scoreData.map((item) => (
            <td key={item.periodName}>{item.teams.away.score}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
