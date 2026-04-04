import FixtureRoundList from "@/components/all-sports/FixtureRoundList";
import DateNav from "@/components/misc-ui/DateNav";
import { GOLF_TOURS, MOTORSPORT_CATEGORIES } from "@/lib/constants";
import { getClientDate } from "@/lib/serverUtils";
import { americanFootballMatchesByDate } from "@/services/american-football.service";
import { aussieRulesCurrentMatches } from "@/services/aussie-rules.service";
import { baseballMatchesByDate } from "@/services/baseball.service";
import { basketballMatchesByDate } from "@/services/basketball.service";
import { cricketMatchesByDate } from "@/services/cricket.service";
import { footballMatchesByDate } from "@/services/football.service";
import { golfTournamentsByDate } from "@/services/golf.service";
import { iceHockeyMatchesByDate } from "@/services/ice-hockey.service";
import { motorsportCategoriesByDate } from "@/services/motorsport.service";
import { netballMatchesByDate } from "@/services/netball.service";
import { rugbyLeagueMatchesByDate } from "@/services/rugby-league.service";
import { rugbyUnionMatchesByDate } from "@/services/rugby-union.service";
import { TennisMatchesByDate as tennisMatchesByDate } from "@/services/tennis.service";
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
    tennisMatchesByDate(parsedDate),
    footballMatchesByDate(parsedDate),
    basketballMatchesByDate(parsedDate),
    baseballMatchesByDate(parsedDate),
    americanFootballMatchesByDate(parsedDate),
    rugbyLeagueMatchesByDate(parsedDate),
    aussieRulesCurrentMatches(parsedDate),
    iceHockeyMatchesByDate(parsedDate),
    golfTournamentsByDate(parsedDate),
    motorsportCategoriesByDate(parsedDate),
    rugbyUnionMatchesByDate(parsedDate),
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
