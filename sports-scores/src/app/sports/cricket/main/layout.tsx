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
            href: "matches",
            label: "Matches",
            page: "matches",
          },
          {
            href: "series",
            label: "Series",
            page: "series",
          },
        ]}
      />
      {children}
    </div>
  );
}
