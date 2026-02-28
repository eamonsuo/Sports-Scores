import Placeholder from "@/components/misc-ui/Placeholder";
import RugbyUnionLadder from "@/components/rugby-union/RugbyUnionLadder";
import { rugbyUnionStandings } from "@/services/rugby-union.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await rugbyUnionStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <>
      {pageData.standings.map((table, index) => (
        <RugbyUnionLadder
          key={index}
          data={table}
          qualifyingPosition={pageData.qualifyingPosition}
        />
      ))}
    </>
  );
}
