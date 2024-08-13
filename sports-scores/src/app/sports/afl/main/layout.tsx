import { fetchAFLStatus } from "@/api/afl.api";
import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import { redirect } from "next/navigation";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = await fetchAFLStatus();

  if (status === null) {
    redirect("/misc/apiError");
  }

  return (
    <div className="flex h-full flex-col">
      <NavButtonGroup
        buttons={[
          {
            href: "matches",
            label: "Matches",
            page: "matches",
          },
          {
            href: "ladder",
            label: "Ladder",
            page: "ladder",
          },
        ]}
      />
      {children}
      <APIStatus data={status} />
    </div>
  );
}
