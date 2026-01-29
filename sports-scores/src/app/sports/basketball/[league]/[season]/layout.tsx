import NavButtonGroup from "@/components/misc-ui/NavButtonGroup";

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
            href: "./matches",
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
