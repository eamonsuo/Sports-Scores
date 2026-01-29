import FootballLadder from "@/components/football/FootballLadder";
import Placeholder from "@/components/misc-ui/Placeholder";
import { footballStandings } from "@/services/football.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await footballStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <FootballLadder
      data={pageData.standings}
      qualifyingPosition={pageData.qualifyingPosition}
    />
  );
}
