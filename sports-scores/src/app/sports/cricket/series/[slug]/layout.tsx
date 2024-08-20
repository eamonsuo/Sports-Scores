import { fetchAFLStatus } from "@/api/afl.api";
import APIStatus from "@/components/misc/ApiStatus";
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
            href: "",
            label: "1",
            page: "",
          },
          {
            href: "",
            label: "2",
            page: "",
          },
        ]}
      />
      {children}m
    </div>
  );
}
