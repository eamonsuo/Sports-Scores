import { redirect } from "next/navigation";

export default async function Page() {
  return (
    <iframe
      src="https://www.google.com/search?igu=1&gws_rd=ssl&q=nrl"
      className="h-full w-full"
    />
  );
}
