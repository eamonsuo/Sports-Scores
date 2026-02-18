import { MOTORSPORT_CATEGORIES } from "@/lib/constants";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  return redirect(
    `/sport/motorsport/${MOTORSPORT_CATEGORIES[0].slug}/${MOTORSPORT_CATEGORIES[0].seasons[0].slug}`,
  );
}
