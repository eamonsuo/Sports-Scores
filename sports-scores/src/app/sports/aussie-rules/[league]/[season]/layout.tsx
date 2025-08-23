import NavButtonGroup from "@/components/misc/NavButtonGroup";
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
            href: "./matches",
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
