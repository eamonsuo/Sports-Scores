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
            href: "./matches#current-date",
            label: "Matches",
            page: "matches",
          },
          // {
          //   href: "./ladder",
          //   label: "Ladder",
          //   page: "ladder",
          // },
          {
            href: "./bracket",
            label: "Bracket",
            page: "bracket",
          },
        ]}
      />
      {children}
    </>
  );
}
