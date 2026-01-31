import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import { americanFootballCurrentMatches } from "@/services/american-football.service";
import { aussieRulesCurrentMatches } from "@/services/aussie-rules.service";
import { baseballCurrentMatches } from "@/services/baseball.service";
import { basketballCurrentMatches } from "@/services/basketball.service";
import { cricketMatchesByDate } from "@/services/cricket.service";
import { footballCurrentMatches } from "@/services/football.service";
import { golfTournamentsByDate } from "@/services/golf.service";
import { motorsportCategoriesByDate } from "@/services/motorsport.service";
import { rugbyLeagueCurrentMatches } from "@/services/rugby-league.service";
import { TennisMatchesByDate as tennisMatchesByDate } from "@/services/tennis.service";
import { RoundDetails } from "@/types/misc";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [
    cricketoday,
    tennisToday,
    footballToday,
    basketballToday,
    baseballToday,
    americanFootballToday,
    rugbyLeagueToday,
    aussieRulesToday,
  ] = await Promise.all([
    cricketMatchesByDate(new Date()),
    tennisMatchesByDate(new Date()),
    footballCurrentMatches(new Date()),
    basketballCurrentMatches(new Date()),
    baseballCurrentMatches(new Date()),
    americanFootballCurrentMatches("TODAY"),
    rugbyLeagueCurrentMatches("TODAY"),
    aussieRulesCurrentMatches("TODAY"),
  ]);

  const golfToday = golfTournamentsByDate(new Date());
  const motorsportToday = motorsportCategoriesByDate(new Date()); // Placeholder for motorsport matches fetching logic
  const dartsToday = null; // Placeholder for darts matches fetching logic
  const cyclingToday = null; // Placeholder for cycling matches fetching logic

  const allSports: RoundDetails[] = ([] as RoundDetails[])
    .concat([{ matches: cricketoday ?? [], roundLabel: "🏏 Cricket" }])
    .concat(rugbyLeagueToday?.fixtures ?? [])
    .concat(aussieRulesToday?.fixtures ?? [])
    .concat(americanFootballToday?.fixtures ?? [])
    .concat([{ matches: golfToday ?? [], roundLabel: "⛳ Golf" }])
    .concat([{ matches: motorsportToday ?? [], roundLabel: "🏎️ Motorsport" }])
    .concat(footballToday?.fixtures ?? [])
    .concat(basketballToday?.fixtures ?? [])
    .concat(baseballToday?.fixtures ?? [])
    .concat(tennisToday?.fixtures ?? []);

  return (
    <div className="flex h-full flex-col">
      <h1 className="mx-2 my-4 text-3xl font-bold text-gray-600 dark:text-neutral-200">
        Today&apos;s Matches
      </h1>
      <FixtureRoundList
        data={allSports}
        curRound={allSports[0]?.roundLabel ?? ""}
      />
    </div>
  );
}
