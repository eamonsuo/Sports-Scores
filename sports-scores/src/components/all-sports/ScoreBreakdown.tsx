import fallback from "@/../public/vercel.svg"
import { PeriodScore } from "@/types/misc"
import Image from "next/image"

export default function ScoreBreakdown({
  scoreData,
  homeLogo,
  awayLogo,
}: {
  scoreData: PeriodScore[]
  homeLogo?: string | string[]
  awayLogo?: string | string[]
}) {
  return (
    <table className="m-4 text-center dark:text-neutral-400">
      <thead>
        <tr>
          <th></th>
          {scoreData.map((item) => (
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
                    width={40}
                    height={40}
                    style={{ width: "15px", height: "auto" }}
                    alt={`Home player ${idx + 1}`}
                    className="rounded-full border border-white dark:border-neutral-800"
                  />
                ))}
              </div>
            ) : (
              <Image
                src={homeLogo ?? fallback}
                width={40}
                height={40}
                style={{ width: "15px", height: "auto" }}
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
                    width={40}
                    height={40}
                    style={{ width: "15px", height: "auto" }}
                    alt={`Away player ${idx + 1}`}
                    className="rounded-full border border-white dark:border-neutral-800"
                  />
                ))}
              </div>
            ) : (
              <Image
                src={awayLogo ?? fallback}
                width={40}
                height={40}
                style={{ width: "15px", height: "auto" }}
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
  )
}
