import { redirect } from "next/navigation";

export default async function Page() {
  return redirect("https://www.pdc.tv/tournaments/calendar");
}
