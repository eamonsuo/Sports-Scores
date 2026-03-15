"use client";

import { API_RESET_PERIOD } from "@/lib/apiCounter";
import { getQuota } from "@/lib/quotaActions";
import { SPORT } from "@/types/misc";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function APIStatus({
  sport,
  className,
}: {
  sport: SPORT;
  className?: string;
}) {
  const [status, setStatus] = useState<number | string>("N/A");
  const pathname = usePathname();
  const reset = API_RESET_PERIOD[sport] ?? "N/A";

  useEffect(() => {
    getQuota(sport).then((quota) => {
      setStatus(quota?.percentUsed ?? "N/A");
    });
  }, [pathname, sport]);

  return (
    <div
      className={clsx(
        "p-1 dark:bg-neutral-900 dark:text-neutral-400",
        className,
      )}
    >{`API Calls: ${status}% used (${reset})`}</div>
  );
}
