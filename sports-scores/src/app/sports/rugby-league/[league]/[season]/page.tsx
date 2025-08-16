import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;

  redirect(`/sports/rugby-league/${league}/${season}/matches`);
}
