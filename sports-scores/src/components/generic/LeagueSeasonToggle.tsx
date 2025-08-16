"use client";

import { SPORT } from "@/types/misc";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../misc/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type LeagueSeasonConfig = {
  name: string;
  slug: string;
  seasons: { name: string; slug: string }[];
};

export default function LeagueSeasonToggle({
  sport,
  leagues,
}: {
  sport: SPORT;
  leagues: LeagueSeasonConfig[];
}) {
  const [selectedLeague, setSelectedLeague] = useState(leagues[0]);
  const [selectedSeason, setSelectedSeason] = useState(leagues[0].seasons[0]);
  const router = useRouter();

  // Helper to redirect to the correct route
  const redirectToRoute = (league: string, season: string) => {
    console.log(league);
    router.push(`/sports/${sport}/${league}/${season}`);
  };

  // When league changes, reset season to first available for that league
  const handleLeagueChange = (league: (typeof leagues)[0]) => {
    setSelectedLeague(league);
    setSelectedSeason(league.seasons[0]);
    console.log(league);
    redirectToRoute(league.slug, league.seasons[0].slug);
  };

  // When "Today" is clicked, reset to first league and its first season
  const handleTodayClick = () => {
    setSelectedLeague(leagues[0]);
    setSelectedSeason(leagues[0].seasons[0]);
  };

  return (
    <div className="flex items-center justify-center gap-4 bg-neutral-100 py-4 dark:bg-neutral-900">
      <Link
        href={`/sports/${sport}/today`}
        className="rounded bg-neutral-700 px-4 py-2 text-white transition hover:bg-neutral-800 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-500"
        onClick={handleTodayClick}
      >
        Today
      </Link>
      {/* League Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between">
            {selectedLeague.name}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-full border bg-background"
        >
          {leagues.map((league) => (
            <DropdownMenuItem
              key={league.slug}
              onClick={() => handleLeagueChange(league)}
            >
              {league.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Season/Year Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between">
            {selectedSeason.name}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-full border bg-background"
        >
          {selectedLeague.seasons.map((season) => (
            <DropdownMenuItem
              key={season.slug}
              onClick={() => {
                setSelectedSeason(season);
                console.log(selectedLeague);
                redirectToRoute(selectedLeague.slug, season.slug);
              }}
            >
              {season.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
