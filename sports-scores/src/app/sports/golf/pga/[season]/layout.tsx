import NavButtonGroup from "@/components/misc-ui/NavButtonGroup";

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
              href: "./schedule#current-date",
              label: "Schedule",
              page: "schedule",
            },
            {
              href: "./fedexcup",
              label: "FedEx Cup",
              page: "fedexcup",
            },
          ]}
        />
        {children}
      </div>
    </div>
  );
}
