import Placeholder from "@/components/misc/Placeholder";
import F1SessionStandings from "@/components/motorsport/f1/F1SessionStandings";
import { f1SessionResults } from "@/services/motorsport.service";
import { F1SessionType } from "@/types/f1";

export default async function Page(props: {
  params: Promise<{ round: number; session: F1SessionType }>;
}) {
  const params = await props.params;
  const sessionResults = await f1SessionResults(
    2025,
    params.round,
    params.session,
  );

  if (sessionResults === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <F1SessionStandings data={sessionResults.results} />;
}
