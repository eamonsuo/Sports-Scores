import { ICE_HOCKEY_LEAGUES } from "@/lib/constants";
import { SPORT } from "@/types/misc";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;

  if (season === "wiki") {
    return (
      <iframe
        src={`${ICE_HOCKEY_LEAGUES.find((l) => l.slug === league)?.externalURL}`}
        title="Wikipedia Page"
        className="h-screen w-full border-0"
      />
    );
  }

  redirect(`/sports/${SPORT.ICE_HOCKEY}/${league}/${season}/matches`);
}
