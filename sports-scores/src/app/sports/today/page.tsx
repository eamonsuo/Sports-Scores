import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import DateNav from "@/components/misc-ui/DateNav";
import { GOLF_TOURS, MOTORSPORT_CATEGORIES } from "@/lib/constants";
import { getClientDate } from "@/lib/serverUtils";
import { americanFootballService } from "@/services/american-football.service";
import { aussieRulesService } from "@/services/aussie-rules.service";
import { baseballService } from "@/services/baseball.service";
import { basketballService } from "@/services/basketball.service";
import { cricketMatchesByDate } from "@/services/cricket.service";
import { footballService } from "@/services/football.service";
import { golfTournamentsByDate } from "@/services/golf.service";
import { iceHockeyService } from "@/services/ice-hockey.service";
import { motorsportCategoriesByDate } from "@/services/motorsport.service";
import { netballMatchesByDate } from "@/services/netball.service";
import { rugbyLeagueService } from "@/services/rugby-league.service";
import { rugbyUnionService } from "@/services/rugby-union.service";
import { tennisService } from "@/services/tennis.service";
import { FixtureRound, SPORT } from "@/types/misc";
import { TZDate } from "@date-fns/tz/date";

// export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const date = (await searchParams)?.date; //Gets ?date= query string
  const curDate = await getClientDate();
  const parsedDate =
    date === undefined ? curDate : new TZDate(date as string, curDate.timeZone);
  const [
    cricketoday,
    tennisToday,
    footballToday,
    basketballToday,
    baseballToday,
    americanFootballToday,
    rugbyLeagueToday,
    aussieRulesToday,
    iceHockeyToday,
    golfToday,
    motorsportToday,
    rugbyUnionToday,
    netballToday,
    surfingToday,
    dartsToday,
    cyclingToday,
  ] = await Promise.all([
    cricketMatchesByDate(parsedDate),
    tennisService.matchesByDate(parsedDate),
    footballService.matchesByDate(parsedDate),
    basketballService.matchesByDate(parsedDate),
    baseballService.matchesByDate(parsedDate),
    americanFootballService.matchesByDate(parsedDate),
    rugbyLeagueService.matchesByDate(parsedDate),
    aussieRulesService.matchesByDate(parsedDate),
    iceHockeyService.matchesByDate(parsedDate),
    golfTournamentsByDate(parsedDate),
    motorsportCategoriesByDate(parsedDate),
    rugbyUnionService.matchesByDate(parsedDate),
    netballMatchesByDate(parsedDate),
    null,
    null,
    null,
  ]);

  const allSports: FixtureRound[] = ([] as FixtureRound[])
    .concat([
      {
        matches: cricketoday ?? [],
        roundLabel: "Cricket",
        roundSlug: `${SPORT.CRICKET}/main/matches`,
      },
    ])
    .concat(rugbyLeagueToday?.fixtures ?? [])
    .concat(aussieRulesToday?.fixtures ?? [])
    .concat(americanFootballToday?.fixtures ?? [])
    .concat([
      {
        matches: golfToday ?? [],
        roundLabel: "Golf",
        roundSlug: `${SPORT.GOLF}/${GOLF_TOURS[0].slug}/${GOLF_TOURS[0].seasons[0].slug}`,
      },
    ])
    .concat([
      {
        matches: motorsportToday ?? [],
        roundLabel: "Motorsport",
        roundSlug: `${SPORT.MOTORSPORT}/${MOTORSPORT_CATEGORIES[0].slug}/${MOTORSPORT_CATEGORIES[0].seasons[0].slug}`,
      },
    ])
    .concat(footballToday?.fixtures ?? [])
    .concat(basketballToday?.fixtures ?? [])
    .concat(baseballToday?.fixtures ?? [])
    .concat(iceHockeyToday?.fixtures ?? [])
    .concat(tennisToday?.fixtures ?? [])
    .concat(rugbyUnionToday?.fixtures ?? [])
    .concat(netballToday?.fixtures ?? []);

  return (
    <div className="flex h-full flex-col">
      <h1 className="mx-2 my-4 text-3xl font-bold text-gray-600 dark:text-neutral-200">
        Today&apos;s Matches
      </h1>
      <FixtureRoundList
        data={allSports}
        curRound={allSports[0]?.roundLabel ?? ""}
      />
      <DateNav date={parsedDate} />
    </div>
  );
}
