import { SPORT } from "@/types/misc";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;

  redirect(`/sports/${SPORT.AUSSIE_RULES}/${league}/${season}/matches`);
}
