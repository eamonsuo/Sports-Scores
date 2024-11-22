import Image from "next/image";

export default function WeekendSummaryCard({
  img,
  grandPrix,
  status,
}: {
  img: string;
  grandPrix: string;
  status: string;
}) {
  return (
    <div className="mt-4 flex items-center gap-4 rounded-md border border-gray-300 p-4 shadow-sm active:bg-gray-300 dark:border-neutral-500 dark:text-neutral-400 dark:active:bg-neutral-700">
      <Image src={img} height={70} width={50} alt="Circuit Logo" />
      <div className="flex flex-1 flex-col text-center">
        <p>{grandPrix}</p>
        <p>{status}</p>
      </div>
    </div>
  );
}
