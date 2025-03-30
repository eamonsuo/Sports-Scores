import { fetchBaseballStatus } from "@/api/baseball.api";
import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";
import Placeholder from "@/components/misc/Placeholder";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = await fetchBaseballStatus();

  if (typeof status === "string") {
    return <Placeholder>{status}</Placeholder>;
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
      <APIStatus status="N/A" />
    </div>
  );
}
