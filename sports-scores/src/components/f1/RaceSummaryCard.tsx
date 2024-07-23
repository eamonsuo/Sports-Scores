import { SessionSummary } from "@/types/f1";
import Image from "next/image";
import Link from "next/link";

export default function RaceSummaryCard({
  id,
  href,
  img,
  sessionType,
  grandPrix,
  status,
}: {
  id: number;
  href: string;
  img: string;
  sessionType: string;
  grandPrix: string;
  status: string;
}) {
  return (
    <Link href={href}>
      <div className="mt-4 flex items-center gap-4 rounded-md border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-400 dark:active:bg-neutral-700">
        <Image src={img} height={70} width={50} alt="Circuit Logo" />
        <div className="flex flex-1 flex-col">
          <p>{sessionType}</p>
          <p>{grandPrix}</p>
          <p>{status}</p>
        </div>
        <p>&gt;</p>
      </div>
    </Link>
  );
}
