import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex h-full flex-col px-4">
        <Link
          className="mt-4 flex justify-between rounded-md border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-500 dark:active:bg-neutral-700"
          href="https://en.wikipedia.org/wiki/2026_PDC_World_Darts_Championship"
        >
          World Champs 2026
        </Link>
        <Link
          className="mt-4 flex justify-between rounded-md border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-500 dark:active:bg-neutral-700"
          href="https://www.flashscore.com.au/darts/"
        >
          All Darts
        </Link>
        <Link
          className="mt-4 flex justify-between rounded-md border border-gray-300 p-2 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-500 dark:active:bg-neutral-700"
          href="https://www.pdc.tv/tournaments/calendar"
        >
          PDC Schedule
        </Link>
        {/* <NavButtonGroup
        buttons={[
          {
            href: "/sports/darts/pdc/tournaments#current-date",
            label: "Tournaments",
            page: "tournaments",
          },
          {
            href: "/sports/darts/pdc/rankings",
            label: "PDC Rankings",
            page: "rankings",
          },
        ]}
      />
      {children} */}
      </div>
    </div>
  );
}
