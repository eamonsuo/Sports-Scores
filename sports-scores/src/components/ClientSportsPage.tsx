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
    <div className="flex flex-col h-full">
      <div className="flex m-4">
        {options.map((item) => (
          <button
            key={item.state}
            className="bg-gray-400 text-center p-2 border-2 flex-1 active:bg-gray-700 focus:bg-gray-600"
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
