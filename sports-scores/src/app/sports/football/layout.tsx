import LeagueSeasonToggle from "@/components/generic/LeagueSeasonToggle";
import APIStatus from "@/components/misc/ApiStatus";
import { SPORT } from "@/types/misc";
import React from "react";

const leagues = [
  {
    name: "Premier League",
    slug: "premier-league",
    seasons: [
      { name: "2025", slug: "2025" },
      { name: "2024", slug: "2024" },
      { name: "2023", slug: "2023" },
      { name: "2022", slug: "2022" },
    ],
  },
  {
    name: "La Liga",
    slug: "la-liga",
    seasons: [
      { name: "2025", slug: "2025" },
      { name: "2024", slug: "2024" },
    ],
  },
  {
    name: "Bundesliga",
    slug: "bundesliga",
    seasons: [{ name: "2025", slug: "2025" }],
  },
];

export default function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <LeagueSeasonToggle leagues={leagues} sport={SPORT.FOOTBALL} />
      <main className="w-full">{children}</main>
      <APIStatus status="N/A" reset="per month" />
    </div>
  );
}
