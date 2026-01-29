import Placeholder from "@/components/misc-ui/Placeholder";
import NRLLadder from "@/components/rugby-league/NRLLadder";
import { rugbyLeagueStandings } from "@/services/rugby-league.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await rugbyLeagueStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <>
      {pageData.standings.map((table, index) => (
        <NRLLadder
          key={index}
          data={table}
          qualifyingPosition={pageData.qualifyingPosition}
        />
      ))}
    </>
  );
}
