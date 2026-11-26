import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle"
import APIStatus from "@/components/misc-ui/ApiStatus"
import { leaguesBySportToShow } from "@/services/dataverse.service"
import { SPORT } from "@/types/misc"

export default async function SportsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ sport: string }>
}) {
  const { sport } = await params
  const leagues = await leaguesBySportToShow(sport as SPORT)

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle sport={sport as SPORT} leagues={leagues} />
      {children}
      <APIStatus sport={sport as SPORT} />
    </div>
  )
}
