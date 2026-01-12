import { SPORT } from "@/types/misc";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ teamid: string }>;
}) {
  const { teamid } = await props.params;

  redirect(`/sports/${SPORT.FOOTBALL}/team/${teamid}/matches`);
}
