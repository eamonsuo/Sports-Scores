import Placeholder from "@/components/misc-ui/Placeholder";
import { netballStandings } from "@/services/netball.service";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await netballStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <>
      {/* {pageData.standings.map((table, index) => (
        <NetballLadder
          key={index}
          data={table}
          qualifyingPosition={pageData.qualifyingPosition}
        />
      ))} */}
    </>
  );
}
