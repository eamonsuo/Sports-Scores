import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <NavButtonGroup
        buttons={[
          {
            href: "/sports/nrl/matches",
            label: "Matches",
            page: "matches",
          },
          {
            href: "/sports/nrl/ladder",
            label: "Ladder",
            page: "ladder",
          },
        ]}
      />
      {children}
      <APIStatus status="N/A" />
    </div>
  );
}
