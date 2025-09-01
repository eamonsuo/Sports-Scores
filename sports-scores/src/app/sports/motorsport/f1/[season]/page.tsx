import { SPORT } from "@/types/misc";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await props.params;

  redirect(`/sports/${SPORT.MOTORSPORT}/f1/${season}/races`);
}
