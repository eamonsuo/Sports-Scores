import Placeholder from "@/components/misc/Placeholder";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  // const pageData = await footballStandings(Number(league), Number(season));

  // if (pageData === null) {
  //   return <Placeholder>NO DATA</Placeholder>;
  // }

  // return <NRLLadder data={pageData.standings} />;
  return <Placeholder>Not Implemented</Placeholder>;
}
