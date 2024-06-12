"use client";
import { ReactNode, useState } from "react";

export default function ClientSportsPage({
  matches,
  ladder,
  apiStatus,
}: {
  matches: ReactNode;
  ladder: ReactNode;
  apiStatus: ReactNode;
}) {
  const [view, setView] = useState<"matches" | "ladder">("matches");

  return (
    <div className="flex flex-col h-full">
      <div className="flex m-4">
        <button
          className="bg-gray-500 text-center p-2 border-2 flex-1"
          onClick={() => setView("matches")}
        >
          Matches
        </button>

        <button
          className="bg-gray-500 text-center p-2 border-2 flex-1"
          onClick={() => setView("ladder")}
        >
          Ladder
        </button>
      </div>
      {view === "matches" ? matches : ladder}
      {apiStatus}
    </div>
  );
}
