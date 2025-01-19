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
            href: "/sports/golf/pga/schedule",
            label: "Schedule",
            page: "schedule",
          },
          {
            href: "/sports/golf/pga/fedexcup",
            label: "FedEx Cup",
            page: "fedexcup",
          },
        ]}
      />
      {children}
    </div>
  );
}
