import LeagueHeader from "@/components/all-sports/LeagueLayout"
import { SPORT } from "@/types/misc"
import { Suspense } from "react"

export default async function SportsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ sport: string; league: string; season: string }>
}) {
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        {/* await happens inside the boundary, so the shell still renders */}
        {params.then(({ sport, league, season }) => (
          <LeagueHeader
            sport={sport as SPORT}
            league={league}
            season={season}
          />
        ))}
      </Suspense>
      {children}
    </>
  )
}
