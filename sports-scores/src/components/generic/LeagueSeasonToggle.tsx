"use client";

import { SPORT } from "@/types/misc";
import { ChevronDownIcon } from "lucide-react";
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
  qualifyingPosition?: number;
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
  const [todayActive, setTodayActive] = useState(false);
  const router = useRouter();

  // Helper to redirect to the correct route
  const redirectToRoute = (league: string, season: string) => {
    router.push(`/sports/${sport}/${league}/${season}`);
  };

  // When league changes, reset season to first available for that league
  const handleLeagueChange = (league: (typeof leagues)[0]) => {
    setSelectedLeague(league);
    setSelectedSeason(league.seasons[0]);
    setTodayActive(false);
    redirectToRoute(league.slug, league.seasons[0].slug);
  };

  // When "Today" is clicked, reset to first league and its first season
  const handleTodayClick = () => {
    if (!todayActive) {
      setTodayActive(true);
      router.push(`/sports/${sport}/today`);
    } else {
      setTodayActive(false);
      redirectToRoute(selectedLeague.slug, selectedSeason.slug);
    }
  };

  // Helper to truncate long names
  const truncateName = (name: string, maxLength = 14) =>
    name.length > maxLength ? name.slice(0, maxLength - 3) + "..." : name;

  return (
    <div className="flex items-center justify-center gap-4 bg-neutral-100 py-4 dark:bg-neutral-900">
      <Button
        variant="outline"
        className="rounded bg-neutral-600 px-4 py-2"
        onClick={handleTodayClick}
      >
        {todayActive ? "Fixtures" : "Today"}
      </Button>
      {/* League Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between">
            {truncateName(selectedLeague.name)}
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
