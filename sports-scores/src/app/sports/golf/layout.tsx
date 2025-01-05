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
            href: "/sports/golf",
            label: "Current Tournaments",
            page: "home",
          },
        ]}
      />
      {children}
    </div>
  );
}
