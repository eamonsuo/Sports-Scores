import APIStatus from "@/components/misc/ApiStatus";
import NavButtonGroup from "@/components/misc/NavButtonGroup";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const status = await fetchAFLStatus();

  // if (typeof status === "string") {
  //   return <Placeholder>{status}</Placeholder>;
  // }

  return (
    <div className="flex h-full flex-col">
      <NavButtonGroup
        buttons={[
          {
            href: "/sports/afl/matches",
            label: "Matches",
            page: "matches",
          },
          {
            href: "/sports/afl/ladder",
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
