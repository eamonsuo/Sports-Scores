import { fetchNFLStatus } from "@/api/nfl.api";
import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = await fetchNFLStatus();
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
            label: "Standings",
            page: "ladder",
          },
        ]}
      />
      {children}
      <APIStatus data={status} />
    </div>
  );
}
