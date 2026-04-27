import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ league: string; season: string; sport: string }>;
}) {
  const { league, season, sport } = await props.params;

  redirect(`/sports/${sport}/${league}/${season}/matches`);
}
