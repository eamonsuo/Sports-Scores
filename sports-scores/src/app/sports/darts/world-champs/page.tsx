import { redirect } from "next/navigation";

// export const dynamic = "force-dynamic";

export default async function Page() {
  return redirect(
    "https:/en.wikipedia.org/wiki/2026_PDC_World_Darts_Championship",
  );
}
