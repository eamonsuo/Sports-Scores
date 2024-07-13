import { Button } from "@/components/misc/Button";
import { redirect } from "next/navigation";

export default async function Page() {
  return (
    <div className="flex h-full flex-col items-center">
      <Button variant="destructive"> Custom Look Coming Soon</Button>
      <iframe
        src="https://www.google.com/search?igu=1&gws_rd=ssl&q=nrl"
        className="w-full flex-1"
      />
    </div>
  );
}
