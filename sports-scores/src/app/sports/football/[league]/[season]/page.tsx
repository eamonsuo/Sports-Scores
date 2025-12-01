import { SPORT } from "@/types/misc";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;

  switch (league) {
    case "fifaQualifiers":
      redirect(
        `https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification`,
      );
    case "fifaWQualifiers":
      redirect(
        `https://en.wikipedia.org/wiki/2027_FIFA_Women%27s_World_Cup_qualification`,
      );
    default:
      redirect(`/sports/${SPORT.FOOTBALL}/${league}/${season}/matches`);
  }
}
