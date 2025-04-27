import F1SessionStandings from "@/components/f1/F1SessionStandings";
import Placeholder from "@/components/misc/Placeholder";
import { f1SessionResults } from "@/services/f1.service";

export default async function Page(props: {
  params: Promise<{ round: number; session: string }>;
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
