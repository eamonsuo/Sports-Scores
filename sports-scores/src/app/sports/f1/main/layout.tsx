import { fetchF1Status } from "@/api/f1.api";
import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import Placeholder from "@/components/misc/Placeholder";

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
            href: "races#current-date",
            label: "Races",
            page: "races",
          },
          {
            href: "drivers",
            label: "Drivers",
            page: "drivers",
          },
          {
            href: "teams",
            label: "Teams",
            page: "teams",
          },
        ]}
      />
      {children}
      <APIStatus data={status} />
    </div>
  );
}
