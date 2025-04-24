import AFLLadder from "@/components/afl/AFLLadder";
import Placeholder from "@/components/misc/Placeholder";
import { AFLStandings } from "@/services/afl.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const pageData = await AFLStandings();

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return <AFLLadder data={pageData.standings} />;
}
