"use client";
import { clsx } from "clsx";
import { ReactNode, useState } from "react";

export default function ClientSportsPage({
  options,
  apiStatus,
}: {
  options: { btnLabel: string; component: ReactNode; state: string }[];
  apiStatus: ReactNode;
}) {
  const [view, setView] = useState<string>("matches");

  return (
    <div className="flex h-full flex-col">
      <div className="m-4 flex rounded-lg border border-gray-200 bg-gray-200 p-1">
        {options.map((item) => (
          <button
            key={item.state}
            className={clsx(
              "flex-1 rounded-md px-4 py-2 text-center focus:relative",
              view === item.state
                ? "text-black-500 bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700",
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
