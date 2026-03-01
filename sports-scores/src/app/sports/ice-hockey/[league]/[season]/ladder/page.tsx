import IceHockeyLadder from "@/components/ice-hockey/IceHockeyLadder";
import Placeholder from "@/components/misc-ui/Placeholder";
import { iceHockeyStandings } from "@/services/ice-hockey.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await iceHockeyStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <>
      {pageData.standings.map((table, index) => (
        <IceHockeyLadder
          key={index}
          data={table}
          qualifyingPosition={pageData.qualifyingPosition}
        />
      ))}
    </>
  );
}
