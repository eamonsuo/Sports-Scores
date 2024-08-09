"use client";
import { clsx } from "clsx";
import { ReactNode, useState } from "react";

export default function ClientSportsPage({
  options,
  apiStatus,
  defaultState,
}: {
  options: { btnLabel: string; component: ReactNode; state: string }[];
  apiStatus: ReactNode;
  defaultState: string;
}) {
  const [view, setView] = useState<string>(defaultState);

  return (
    <div className="flex h-full flex-col">
      <div className="m-4 flex rounded-lg bg-gray-200 p-1 dark:bg-neutral-800">
        {options.map((item) => (
          <button
            key={item.state}
            className={clsx(
              "flex-1 rounded-md px-2 py-1.5 text-center focus:relative",
              view == item.state
                ? "bg-white text-black shadow-sm dark:bg-neutral-600 dark:text-neutral-200"
                : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200",
            )}
            onClick={() => setView(item.state)}
          >
            {item.btnLabel}
          </button>
        ))}
      </div>
      {options.map((item) => view === item.state && item.component)}
      {apiStatus}
    </div>
  );
}
