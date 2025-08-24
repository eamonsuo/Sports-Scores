import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  return redirect("/sports/motorsport/f1/main/races");
}
