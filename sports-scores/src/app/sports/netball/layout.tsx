import LeagueSeasonToggle from "@/components/all-sports/LeagueSeasonToggle"
import APIStatus from "@/components/misc-ui/ApiStatus"
import { leaguesBySport } from "@/services/dataverse.service"
import { SPORT } from "@/types/misc"

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const leagues = await leaguesBySport(SPORT.NETBALL)

  return (
    <div className="flex h-full flex-col">
      <LeagueSeasonToggle sport={SPORT.NETBALL} leagues={leagues} />

      {children}
      <APIStatus sport={SPORT.NETBALL} />
    </div>
  )
}
