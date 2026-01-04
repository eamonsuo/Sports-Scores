import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await props.params;

  return redirect(`/sports/golf/liv/${season}/schedule`);
}
