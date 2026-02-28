"use client";

import { DisplayTypes, SPORT } from "@/types/misc";
import { ChevronDownIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../misc-ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../zzzshadcn/dropdown-menu";

export type LeagueSeasonConfig = {
  name: string;
  slug: string;
  seasons: { name: string; slug: string }[];
  qualifyingPosition?: number;
  display?: DisplayTypes;
};

export default function LeagueSeasonToggle({
  sport,
  leagues,
}: {
  sport: SPORT;
  leagues: LeagueSeasonConfig[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Helper to parse league and season from URL
  function getLeagueAndSeasonFromPath(path: string) {
    // Example: /sports/football/epl/2024
    const parts = path.split("/");
    const sportIdx = parts.indexOf("sports");
    if (sportIdx !== -1 && parts.length > sportIdx + 3) {
      return {
        leagueSlug: parts[sportIdx + 2],
        seasonSlug: parts[sportIdx + 3],
      };
    }
    return { leagueSlug: null, seasonSlug: null };
  }

  // Helper to find league and season objects
  function findLeagueAndSeason(
    leagueSlug: string | null,
    seasonSlug: string | null,
  ) {
    const league = leagues.find((l) => l.slug === leagueSlug) || leagues[0];
    const season =
      league.seasons.find((s) => s.slug === seasonSlug) || league.seasons[0];
    return { league, season };
  }

  // State initialization
  const [{ league: initialLeague, season: initialSeason }] = useState(() => {
    const { leagueSlug, seasonSlug } = getLeagueAndSeasonFromPath(
      pathname || "",
    );
    return findLeagueAndSeason(leagueSlug, seasonSlug);
  });
  const [selectedLeague, setSelectedLeague] = useState(initialLeague);
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [todayActive, setTodayActive] = useState(
    pathname?.includes("/today") ?? false,
  );

  // Update state if URL changes (e.g., via navigation)
  useEffect(() => {
    if (pathname?.includes("/today")) {
      setTodayActive(true);
    } else {
      setTodayActive(false);
      const { leagueSlug, seasonSlug } = getLeagueAndSeasonFromPath(
        pathname || "",
      );
      const { league, season } = findLeagueAndSeason(leagueSlug, seasonSlug);
      setSelectedLeague(league);
      setSelectedSeason(season);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, leagues]);

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
