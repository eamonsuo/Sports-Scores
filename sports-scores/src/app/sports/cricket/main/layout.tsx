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
            href: "myteams#current-date",
            label: "My Teams",
            page: "myteams",
          },
          {
            href: "matches#current-date",
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
