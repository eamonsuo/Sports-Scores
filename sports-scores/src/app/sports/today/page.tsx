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
import { rugbyUnionMatchesByDate } from "@/services/rugby-union.service";
import { TennisMatchesByDate as tennisMatchesByDate } from "@/services/tennis.service";
import { FixtureRound, SPORT } from "@/types/misc";

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
    rugbyUnionToday,
  ] = await Promise.all([
    cricketMatchesByDate(curDate),
    tennisMatchesByDate(curDate),
    footballMatchesByDate(curDate),
    basketballMatchesByDate(curDate),
    baseballMatchesByDate(curDate),
    americanFootballMatchesByDate(curDate),
    rugbyLeagueMatchesByDate(curDate),
    aussieRulesCurrentMatches("TODAY"),
    golfTournamentsByDate(curDate),
    motorsportCategoriesByDate(curDate),
    rugbyUnionMatchesByDate(curDate),
  ]);

  const surfingToday = null; // Placeholder for surfing matches fetching logic
  const netballToday = null; // Placeholder for netball matches fetching logic
  const dartsToday = null; // Placeholder for darts matches fetching logic
  const cyclingToday = null; // Placeholder for cycling matches fetching logic

  const allSports: FixtureRound[] = ([] as FixtureRound[])
    .concat([
      {
        matches: cricketoday ?? [],
        roundLabel: "🏏 Cricket",
        roundSlug: `${SPORT.CRICKET}/main/matches`,
      },
    ])
    .concat(rugbyLeagueToday?.fixtures ?? [])
    .concat(aussieRulesToday?.fixtures ?? [])
    .concat(americanFootballToday?.fixtures ?? [])
    .concat([
      {
        matches: golfToday ?? [],
        roundLabel: "⛳ Golf",
        roundSlug: `${SPORT.GOLF}/${GOLF_TOURS[0].slug}/${GOLF_TOURS[0].seasons[0].slug}`,
      },
    ])
    .concat([
      {
        matches: motorsportToday ?? [],
        roundLabel: "🏎️ Motorsport",
        roundSlug: `${SPORT.MOTORSPORT}/${MOTORSPORT_CATEGORIES[0].slug}/${MOTORSPORT_CATEGORIES[0].seasons[0].slug}`,
      },
    ])
    .concat(footballToday?.fixtures ?? [])
    .concat(basketballToday?.fixtures ?? [])
    .concat(baseballToday?.fixtures ?? [])
    .concat(tennisToday?.fixtures ?? [])
    .concat(rugbyUnionToday?.fixtures ?? []);

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
