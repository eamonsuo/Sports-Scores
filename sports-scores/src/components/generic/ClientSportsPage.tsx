"use client";
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
      <div className="m-4 flex">
        {options.map((item) => (
          <button
            key={item.state}
            className="flex-1 border-2 bg-gray-400 p-2 text-center focus:bg-gray-600 active:bg-gray-700"
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
