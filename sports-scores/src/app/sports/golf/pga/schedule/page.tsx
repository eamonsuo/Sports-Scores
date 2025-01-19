import Placeholder from "@/components/misc/Placeholder";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <div className="flex-1 overflow-y-auto px-4">
      <Placeholder>page waiting</Placeholder>
    </div>
  );
}
