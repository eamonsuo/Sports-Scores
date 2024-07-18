import { SessionSummary } from "@/types/f1";
import Image from "next/image";
import Link from "next/link";

export default function RaceSummaryCard({ data }: { data: SessionSummary }) {
  return (
    <Link href={`/sports/${data.sport}/${data.id}`}>
      <div className="mt-4 flex items-center justify-between rounded-md border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-400 dark:active:bg-neutral-500">
        <Image src={data.logo} height={70} width={50} alt="Circuit Logo" />
        <div className="flex flex-col">
          <p>{data.type}</p>
          <p>{data.name}</p>
          <p>{data.status}</p>
        </div>
        <p>&gt;</p>
      </div>
    </Link>
  );
}
