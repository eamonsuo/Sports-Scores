import NavButtonGroup from "@/components/misc/NavButtonGroup";

export default async function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex h-full flex-col">
        <NavButtonGroup
          buttons={[
            {
              href: "yesterday",
              label: "Yesterday",
              page: "yesterday",
            },
            {
              href: "today",
              label: "Today",
              page: "today",
            },
            {
              href: "tomorrow",
              label: "Tomorrow",
              page: "tomorrow",
            },
          ]}
        />
        {children}
      </div>
    </div>
  );
}
