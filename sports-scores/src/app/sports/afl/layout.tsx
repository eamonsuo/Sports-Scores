import { fetchAFLStatus } from "@/api/afl.api";
import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import Placeholder from "@/components/misc/Placeholder";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = await fetchAFLStatus();

  if (typeof status === "string") {
    return <Placeholder>{status}</Placeholder>;
  }

  return (
    <div className="flex h-full flex-col">
      <NavButtonGroup
        buttons={[
          {
            href: "/sports/afl/main/matches",
            label: "Matches",
            page: "matches",
          },
          {
            href: "/sports/afl/main/ladder",
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
