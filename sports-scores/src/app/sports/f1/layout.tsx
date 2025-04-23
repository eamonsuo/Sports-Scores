import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import Placeholder from "@/components/misc/Placeholder";
import { fetchF1Status } from "@/endpoints/f1.api";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = await fetchF1Status();

  if (typeof status === "string") {
    return <Placeholder>{status}</Placeholder>;
  }

  return (
    <div className="flex h-full flex-col">
      <NavButtonGroup
        buttons={[
          {
            href: "/sports/f1/main/races#current-date",
            label: "Races",
            page: "races",
          },
          {
            href: "/sports/f1/main/drivers",
            label: "Drivers",
            page: "drivers",
          },
          {
            href: "/sports/f1/main/teams",
            label: "Teams",
            page: "teams",
          },
        ]}
      />
      {children}
      <APIStatus status="N/A" />
    </div>
  );
}
