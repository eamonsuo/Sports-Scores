import NavButtonGroup from "@/components/misc/NavButtonGroup";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavButtonGroup
        buttons={[
          {
            href: "./matches#current-date",
            label: "Matches",
            page: "matches",
          },
          {
            href: "./ladder",
            label: "Standings",
            page: "ladder",
          },
        ]}
      />
      {children}
    </>
  );
}
