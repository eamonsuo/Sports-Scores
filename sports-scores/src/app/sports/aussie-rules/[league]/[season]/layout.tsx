import NavButtonGroup from "@/components/misc-ui/NavButtonGroup";
import { getGlobalApiQuota } from "@/lib/apiCounter";
import { SPORT } from "@/types/misc";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  var quota = getGlobalApiQuota(SPORT.AUSSIE_RULES);

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
            label: "Ladder",
            page: "ladder",
          },
        ]}
      />
      {children}
    </>
  );
}
