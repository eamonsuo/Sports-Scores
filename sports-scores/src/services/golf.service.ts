import { GolfLeaderboardPlayerRow } from "@/components/golf/TournamentLeaderboard";
import {
  fetchGolfLeaderboard,
  fetchGolfRankings,
  fetchGolfSchedule,
} from "@/endpoints/golf.api";
import { GOLF_FEDEX_HEADINGS, GOLF_TOURS } from "@/lib/constants";
import { withDevCache } from "@/lib/devCache";
import { getCurrentRound, mapFixtureRounds } from "@/lib/eventMapping";
import { resolveSportImage } from "@/lib/imageMapping";
import { getCountryImageUrl, getSportConfigurations } from "@/lib/projUtils";
import {
  Golf_SlashGolfAPI_Leaderboard,
  SlashGolf_PlayerRanking,
  SlashGolf_Tournament,
} from "@/types/golf";
import {
  Brackets,
  CardVariant,
  CountryFlagCode,
  DeepPartial,
  DisplayTypes,
  LeagueSeasonConfig,
  MatchDetail,
  Matches,
  MatchStatus,
  MatchSummary,
  SPORT,
  SportService,
  Standings,
} from "@/types/misc";
import { addDays } from "date-fns";
import {
  matchSummariesBySportAndDay,
  matchSummariesByTournament,
} from "./dataverse.service";

class GolfService implements SportService {
  protected sport: SPORT;
  protected tours: LeagueSeasonConfig[];
  protected cardVariant?: CardVariant;

  constructor() {
    this.sport = SPORT.GOLF;
    this.tours = GOLF_TOURS;
    this.cardVariant = CardVariant.SESSION;
  }
  async matchesByLeagueSeason(
    leagueId: string,
    seasonId: string,
  ): Promise<Matches | null> {
    //TODO: Make generic for all tours
    // const rawSchedule = await cachedFetchSchedule(
    //   leagueId === "pga" ? "1" : "2",
    //   seasonId,
    // );

    const dataverseMatches = await matchSummariesByTournament(
      leagueId,
      seasonId,
      this.sport,
    );

    // if (!rawSchedule) {
    //   return null;
    // }

    if (!dataverseMatches || dataverseMatches.length === 0) {
      return null;
    }

    // const allMatches = rawSchedule.schedule.map((item) =>
    //   mapTournamentToMatchSummary(item, {
    //     matchSlug: `/sports/${this.sport}/${leagueId}/${seasonId}/match/${item.tournId}`,
    //     roundLabel: leagueId === "pga" ? "FedexCup" : "Schedule",
    //   }),
    // );

    const allMatches = dataverseMatches
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )
      .map(this.eventMapper);

    const { leagueConfig } = getSportConfigurations(
      this.tours,
      leagueId,
      seasonId,
    );

    const fixtures = await mapFixtureRounds(
      allMatches,
      leagueConfig,
      this.cardVariant,
    );

    return {
      fixtures,
      currentRound: getCurrentRound(fixtures, leagueConfig?.display),
    } as Matches;
  }

  async matchesByDate(date: Date): Promise<Matches | null> {
    const [dataverseMatches] = await Promise.all([
      matchSummariesBySportAndDay(this.sport, date),
    ]);

    if (!dataverseMatches || dataverseMatches.length === 0) {
      return null;
    }

    const allMatches = (dataverseMatches ?? [])
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      )
      .concat(golfTournamentsByDate(date))
      .map((event) => this.eventMapper(event));

    const fixtures = await mapFixtureRounds(
      allMatches,
      this.tours,
      this.cardVariant,
    );

    return {
      fixtures: fixtures,
      currentRound: getCurrentRound(fixtures, DisplayTypes.LEAGUE),
    };
  }
  matchesByTeam(teamId: string): Promise<Matches | null> {
    throw new Error("Method not implemented.");
  }
  matchDetails(matchId: string): Promise<MatchDetail | null> {
    throw new Error("Method not implemented.");
  }

  async standings(
    leagueId: string,
    seasonId: string,
  ): Promise<Standings<readonly string[]> | null> {
    const rawRanking = await cachedFetchRankings(
      leagueId === "pga" ? "02671" : "186",
      seasonId,
    );

    if (!rawRanking) {
      return null;
    }

    const { ladderConfig } = getSportConfigurations(
      GOLF_TOURS,
      leagueId,
      seasonId,
    );

    return {
      standings: [
        {
          headings: ladderConfig?.headings ?? GOLF_FEDEX_HEADINGS,
          data: (rawRanking.rankings as SlashGolf_PlayerRanking[]).map(
            (item) => {
              let playerName = item.firstName + " " + item.lastName;
              return {
                position: item.rank,
                team: {
                  id: item.playerId,
                  name: playerName,
                  logo: resolveSportImage(playerName),
                },
                Total: item.totalPoints?.toString() ?? "",
                Behind: item.pointsBehind?.toString() ?? "",
                Prev: item.previousRank?.toString() ?? "",
              };
            },
          ),
          placingCategories: ladderConfig?.placingCategories,
        },
      ],
    };
  }

  brackets(leagueId: string, seasonId: string): Promise<Brackets | null> {
    throw new Error("Method not implemented.");
  }

  eventMapper(event: MatchSummary): MatchSummary {
    let currentDate = new Date();

    const status =
      event.startDate > currentDate
        ? MatchStatus.UPCOMING
        : event.endDate && event?.endDate > currentDate
          ? MatchStatus.LIVE
          : MatchStatus.COMPLETED;

    const tournamentImage =
      event.seriesImg ?? resolveSportImage(event.seriesName ?? "");

    return {
      ...event,
      status,
      seriesImg:
        tournamentImage === "/vercel.svg"
          ? getCountryImageUrl(CountryFlagCode.UnitedStates)
          : tournamentImage,
      timer: status.charAt(0) + status.slice(1).toLowerCase(),
      timerDisplayColour: status === MatchStatus.LIVE ? "green" : "gray",
    };
  }
}

export const golfService = new GolfService();

const cachedFetchSchedule = withDevCache("golf", "schedule", fetchGolfSchedule);
const cachedFetchRankings = withDevCache("golf", "rankings", fetchGolfRankings);
const cachedFetchPGALeaderboard = withDevCache(
  "golf",
  "pga-leaderboard",
  fetchGolfLeaderboard,
);
const cachedFetchLIVLeaderboard = withDevCache(
  "golf",
  "liv-leaderboard",
  fetchGolfLeaderboard,
);

export async function golfPGATournamentLeaderboard(
  tournId: string,
  year: string,
  roundId?: number,
) {
  var rawLeaderboard = await cachedFetchPGALeaderboard(
    "1",
    tournId,
    year,
    roundId,
  );
  if (!rawLeaderboard) {
    return null;
  }

  return mapGolfLeaderboard(rawLeaderboard);
}

export async function golfLIVTournamentLeaderboard(
  tournId: string,
  year: string,
  roundId?: number,
) {
  var rawLeaderboard = await cachedFetchLIVLeaderboard(
    "2",
    tournId,
    year,
    roundId,
  );
  if (!rawLeaderboard) {
    return null;
  }

  return {
    playerLeaderboard: mapGolfLeaderboard(rawLeaderboard),
    teamLeaderboard:
      rawLeaderboard.teams?.map((item, idx) => {
        return {
          name: item.name,
          position: (idx + 1).toString(),
          totalScore: item.totalScore,
          thru: "",
          curRound: "",
          img: resolveSportImage(item.name),
        } as GolfLeaderboardPlayerRow;
      }) ?? [],
  };
}

export function mapGolfLeaderboard(data: Golf_SlashGolfAPI_Leaderboard) {
  return {
    playerPositions: data.leaderboardRows.map((item) => {
      let playerName =
        item.players === undefined
          ? `${item.firstName} ${item.lastName}${item.isAmateur ? " (A)" : ""}`
          : item.players
              .map(
                (item) =>
                  `${item.firstName} ${item.lastName}${item.isAmateur ? " (A)" : ""}`,
              )
              .join(", ");
      return {
        name: playerName,
        position: item.position,
        totalScore: item.total,
        thru: item.thru,
        curRound:
          Number(item.currentRoundScore) > 0 &&
          item.currentRoundScore[0] !== "+"
            ? "+" + item.currentRoundScore
            : item.currentRoundScore,
        img: resolveSportImage(playerName),
      } as GolfLeaderboardPlayerRow;
    }),
  };
}

// Hidden in leagueseasonmatches for now
function mapTournamentToMatchSummary(
  event: SlashGolf_Tournament,
  options?: DeepPartial<MatchSummary>,
): MatchSummary {
  let startDate = new Date(event.date.start + "Z");
  let endDate = new Date(event.date.end + "Z");
  const currentDate = new Date();

  switch (event.name) {
    case "Genesis Scottish Open":
    case "The Open Championship":
    case "Baycurrent Classic":
    case "LIV Golf Riyadh":
    case "LIV Golf Adelaide":
    case "LIV Golf Singapore":
    case "LIV Golf Hong Kong":
    case "LIV Golf South Africa":
    case "LIV Golf Korea":
    case "LIV Golf Andalucia":
    case "LIV Golf UK":
      break;
    default:
      startDate = addDays(startDate, 1);
      endDate = addDays(endDate, 1);
  }

  const tournamentImage = resolveSportImage(event.name);

  const status =
    startDate > currentDate
      ? MatchStatus.UPCOMING
      : endDate > currentDate
        ? MatchStatus.LIVE
        : MatchStatus.COMPLETED;

  return {
    id: options?.id ?? event.tournId,
    startDate: options?.startDate ?? startDate,
    endDate: options?.endDate ?? endDate,
    sport: SPORT.GOLF,
    status: options?.status ?? status,
    summaryText: options?.summaryText ?? "Details",
    roundLabel: options?.roundLabel,
    timer: options?.timer ?? status.charAt(0) + status.slice(1).toLowerCase(),
    timerDisplayColour:
      options?.timerDisplayColour ??
      (status === MatchStatus.LIVE ? "green" : "gray"),
    matchSlug: options?.matchSlug,
    venue: options?.venue,
    seriesName: options?.seriesName ?? event.name,
    seriesSlug: options?.seriesSlug,
    seriesImg:
      (options?.seriesImg ?? tournamentImage === "/vercel.svg")
        ? getCountryImageUrl(CountryFlagCode.UnitedStates)
        : tournamentImage,
    homeDetails: { score: "", name: "" },
    awayDetails: { score: "", name: "" },
    seasonId: options?.seasonId,
    tournamentId: options?.tournamentId,
    winner: options?.winner,
  };
}

export function golfTournamentsByDate(date: Date) {
  // Placeholder for golf matches fetching logic

  function createGolfMatchSummary(
    id: number,
    name: string,
    slug: string,
    img: string,
  ) {
    return {
      id: id.toString(),
      sport: SPORT.GOLF,
      summaryText: "Details",
      startDate: date,
      status: MatchStatus.LIVE,
      awayDetails: { score: "", name: "" },
      homeDetails: { score: "", name: "" },
      matchSlug: `/sports/${SPORT.GOLF}/${slug}/external`,
      seriesName: name,
      seriesImg: img,
      tournamentId: slug,
      seasonId: "external",
    } as MatchSummary;
  }

  const golfTours: MatchSummary[] = [];

  // Basic check for tournaments
  switch (date.getDay()) {
    case 2: // Tuesday
    case 3: // Wednesday
      // golfTours.push(createGolfMatchSummary(0, "TGL", "tgl"));
      break;
    case 4: // Thursday
      // golfTours.push(createGolfMatchSummary(1,"PGA Tour of Australasia","australasia",resolveSportImage("Australia"),), );
      break;
    case 5: // Friday
    case 6: // Saturday
    case 0: // Sunday
      // golfTours.push(createGolfMatchSummary(1,"PGA Tour of Australasia","australasia",resolveSportImage("Australia"),), );
      golfTours.push(
        createGolfMatchSummary(
          4,
          "DP World Tour",
          "dpworld",
          "https://r2.thesportsdb.com/images/media/league/badge/mt8ajv1666867699.png",
        ),
        createGolfMatchSummary(
          5,
          "LPGA Tour",
          "lpga",
          resolveSportImage("USA"),
        ),
      );
      break;
    case 1: // Monday
      golfTours.push(
        // createGolfMatchSummary(1, "PGA Tour of Australasia", "australasia"),
        createGolfMatchSummary(
          4,
          "DP World Tour",
          "dpworld",
          "https://r2.thesportsdb.com/images/media/league/badge/mt8ajv1666867699.png",
        ),
        createGolfMatchSummary(
          5,
          "LPGA Tour",
          "lpga",
          resolveSportImage("USA"),
        ),
      );
      break;
  }
  return golfTours;
}
