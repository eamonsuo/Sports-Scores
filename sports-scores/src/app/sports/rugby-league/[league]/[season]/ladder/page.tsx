import Placeholder from "@/components/misc/Placeholder";
import NRLLadder from "@/components/rugby-league/NRLLadder";
import { rugbyLeagueStandings } from "@/services/rugby-league.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  // const pageData = await rugbyLeagueStandings(tournamentId, seasonId);
  const pageData = await rugbyLeagueStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <NRLLadder data={pageData.standings} />;
}
