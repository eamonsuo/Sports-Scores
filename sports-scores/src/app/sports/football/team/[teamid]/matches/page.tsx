import FixtureList from "@/components/all-sports/FixtureList";
import Placeholder from "@/components/misc-ui/Placeholder";
import { footballService } from "@/services/football.service";

export default async function Page(props: {
  params: Promise<{ teamid: string }>;
}) {
  const { teamid } = await props.params;
  const pageData = await footballService.footballTeamMatches(Number(teamid));

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <FixtureList data={pageData.fixtures} />;
}
