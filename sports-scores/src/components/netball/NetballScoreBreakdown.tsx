import { FALLBACK_IMAGE } from "@/lib/constants"
import Image from "next/image"

export type NetballScoreBreakdown = {
  teams: { home: { score: number }; away: { score: number } }
  periodName: string
}

export default function NetballScoreBreakdown({
  scoreData,
  homeLogo,
  awayLogo,
}: {
  scoreData: NetballScoreBreakdown[]
  homeLogo?: string | string[]
  awayLogo?: string | string[]
}) {
  // Use first image if array (for doubles), and handle empty strings
  const homeLogoSrc = Array.isArray(homeLogo)
    ? homeLogo[0] || undefined
    : homeLogo || undefined
  const awayLogoSrc = Array.isArray(awayLogo)
    ? awayLogo[0] || undefined
    : awayLogo || undefined

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
              src={homeLogoSrc ?? FALLBACK_IMAGE}
              width={40}
              height={40}
              style={{ width: "15px", height: "auto" }}
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
              src={awayLogoSrc ?? FALLBACK_IMAGE}
              width={40}
              height={40}
              style={{ width: "15px", height: "auto" }}
              alt="Away Logo"
            />
          </td>
          {scoreData.map((item) => (
            <td key={item.periodName}>{item.teams.away.score}</td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}
