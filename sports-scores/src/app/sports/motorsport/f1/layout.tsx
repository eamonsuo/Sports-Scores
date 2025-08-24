import NavButtonGroup from "@/components/misc/NavButtonGroup";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex h-full flex-col">
        <NavButtonGroup
          buttons={[
            {
              href: "./races",
              label: "Races",
              page: "races",
            },
            {
              href: "./drivers",
              label: "Drivers",
              page: "drivers",
            },
            {
              href: "./teams",
              label: "Teams",
              page: "teams",
            },
          ]}
        />
        {children}
      </div>
    </div>
  );
}
