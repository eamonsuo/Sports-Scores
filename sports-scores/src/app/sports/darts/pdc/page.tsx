import { redirect } from "next/navigation";

// export const dynamic = "force-dynamic";

export default async function Page() {
  return redirect("https://www.pdc.tv/tournaments/calendar");
}
