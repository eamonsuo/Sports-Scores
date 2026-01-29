import AussieRulesLadder from "@/components/aussie-rules/AussieRulesLadder";
import Placeholder from "@/components/misc-ui/Placeholder";
import { aussieRulesStandings } from "@/services/aussie-rules.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await aussieRulesStandings(Number(league), Number(season));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <AussieRulesLadder
      data={pageData.standings}
      qualifyingPosition={pageData.qualifyingPosition}
    />
  );
}
