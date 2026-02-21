import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import { GOLF_TOURS, MOTORSPORT_CATEGORIES } from "@/lib/constants";
import { americanFootballMatchesByDate } from "@/services/american-football.service";
import { aussieRulesCurrentMatches } from "@/services/aussie-rules.service";
import { baseballMatchesByDate } from "@/services/baseball.service";
import { basketballMatchesByDate } from "@/services/basketball.service";
import { cricketMatchesByDate } from "@/services/cricket.service";
import { footballMatchesByDate } from "@/services/football.service";
import { golfTournamentsByDate } from "@/services/golf.service";
import { motorsportCategoriesByDate } from "@/services/motorsport.service";
import { rugbyLeagueMatchesByDate } from "@/services/rugby-league.service";
import { TennisMatchesByDate as tennisMatchesByDate } from "@/services/tennis.service";
import { RoundDetails, SPORT } from "@/types/misc";

export const dynamic = "force-dynamic";

export default async function Page() {
  const curDate = new Date();
  const [
    cricketoday,
    tennisToday,
    footballToday,
    basketballToday,
    baseballToday,
    americanFootballToday,
    rugbyLeagueToday,
    aussieRulesToday,
    golfToday,
    motorsportToday,
  ] = await Promise.all([
    cricketMatchesByDate(curDate),
    tennisMatchesByDate(curDate),
    footballMatchesByDate(curDate),
    basketballMatchesByDate(curDate),
    baseballMatchesByDate(curDate),
    americanFootballMatchesByDate(curDate),
    rugbyLeagueMatchesByDate(curDate),
    aussieRulesCurrentMatches(curDate),
    golfTournamentsByDate(curDate),
    motorsportCategoriesByDate(curDate),
  ]);

  const dartsToday = null; // Placeholder for darts matches fetching logic
  const cyclingToday = null; // Placeholder for cycling matches fetching logic

  const allSports: RoundDetails[] = ([] as RoundDetails[])
    .concat([
      {
        matches: cricketoday ?? [],
        roundLabel: "🏏 Cricket",
        roundSlug: "main/matches",
        sport: SPORT.CRICKET,
      },
    ])
    .concat(rugbyLeagueToday?.fixtures ?? [])
    .concat(aussieRulesToday?.fixtures ?? [])
    .concat(americanFootballToday?.fixtures ?? [])
    .concat([
      {
        matches: golfToday ?? [],
        roundLabel: "⛳ Golf",
        roundSlug: `${GOLF_TOURS[0].slug}/${GOLF_TOURS[0].seasons[0].slug}`,
        sport: SPORT.GOLF,
      },
    ])
    .concat([
      {
        matches: motorsportToday ?? [],
        roundLabel: "🏎️ Motorsport",
        roundSlug: `${MOTORSPORT_CATEGORIES[0].slug}/${MOTORSPORT_CATEGORIES[0].seasons[0].slug}`,
        sport: SPORT.MOTORSPORT,
      },
    ])
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
