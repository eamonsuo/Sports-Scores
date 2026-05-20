import LeagueLayout from "@/components/all-sports/LeagueLayout"
import { SPORT } from "@/types/misc"

export default async function SportsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ season: string }>
}) {
  const { season } = await params

  return (
    <LeagueLayout sport={SPORT.MOTORSPORT} league="f1" season={season}>
      {children}
    </LeagueLayout>
  )
}
