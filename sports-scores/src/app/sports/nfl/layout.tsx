import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import Placeholder from "@/components/misc/Placeholder";
import { fetchNFLStatus } from "@/endpoints/nfl.api";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = await fetchNFLStatus();

  if (typeof status === "string") {
    return <Placeholder>{status}</Placeholder>;
  }

  return (
    <div className="flex h-full flex-col">
      <NavButtonGroup
        buttons={[
          {
            href: "/sports/nfl/main/matches",
            label: "Matches",
            page: "matches",
          },
          {
            href: "/sports/nfl/main/ladder",
            label: "Standings",
            page: "ladder",
          },
        ]}
      />
      {children}
      <APIStatus status="N/A" />
    </div>
  );
}
