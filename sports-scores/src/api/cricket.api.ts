import {
  compareCricketMatchDates,
  compareCricketSeriesDates,
} from "@/lib/projUtils";
import { scrapeNextData, scrapeNextPages } from "@/lib/scraper";
import {
  CricinfoResponse,
  CricketAllSeriesResults,
  CricketMatch,
  CricketMatchDetails,
  CricketMatchResults,
  CricketSeriesResult,
} from "@/types/cricket";

const MY_TEAMS_URL = [
  "australia-2",
  "australia-women-238",
  "brisbane-heat-509668",
  "brisbane-heat-women-896397",
  "queensland-459",
  "queensland-women-476",
  "australia-a-women-217",
  "prime-minister-s-xi-australia-452",
];

const SERIES_IDS = [
  1445395, //Darwin T20 Series
  1445044, //T20 Spring Series (Pre WBBL)
  1442625, //WBBL
  1443056, //BBL
  1444468, //Sheffield Shield
  1444469, //One Day Cup (Men Domestic)
  1445042, //WNCL
];

export async function fetchCricketMyTeams() {
  let urls = MY_TEAMS_URL.map((item) =>
    "https://www.espncricinfo.com/team/".concat(
      item,
      "/match-schedule-fixtures-and-results",
    ),
  );

  let bulkData = await scrapeNextPages(urls);
  return bulkData
    .filter(
      (item) =>
        Date.parse(item.endDate) > Date.now() - 1000 * 60 * 60 * 24 * 90, //Keep matches that are <=90 days old
    )
    .sort(compareCricketMatchDates);
}

export async function fetchCricketAllSeries() {
  let rawData = await scrapeNextData<CricinfoResponse<CricketAllSeriesResults>>(
    "https://www.espncricinfo.com/cricket-fixtures",
  );

  let series = rawData.props.appPageProps.data.collections.flatMap(
    (item) => item.seriesGroups,
  );

  let combinedSeries: typeof series = [];

  series.map((item) => {
    let duplicate = false;
    for (const com of combinedSeries) {
      if (item.title === com.title) {
        com.items = com.items.concat(item.items);
        duplicate = true;
        break;
      }
    }
    !duplicate && combinedSeries.push(item);
  });

  combinedSeries.map((item) => {
    item.items = item.items.filter(
      (series) =>
        Date.parse(series.series.endDate) >
        Date.now() - 1000 * 60 * 60 * 24 * 10, //Filter out series more than 10 days old
    );

    item.items = item.items.filter(
      (obj, index) =>
        item.items.findIndex((series) => series.series.id === obj.series.id) ===
        index,
    ); //Filter out duplicate series in a Series group

    item.items.sort(compareCricketSeriesDates);
  });

  return combinedSeries;
}

export async function fetchCricketCurrentMatches() {
  let liveMatches = await scrapeNextData<CricinfoResponse<any>>( //TODO: Define response type
    "https://www.espncricinfo.com/live-cricket-score",
  );

  let pastMatches = await scrapeNextData<CricinfoResponse<any>>(
    "https://www.espncricinfo.com/live-cricket-match-results",
  );

  return (
    liveMatches.props.appPageProps.data.content.matches
      // .concat(upcomingMatches.props.appPageProps.data.data.content.matches)
      .concat(pastMatches.props.appPageProps.data.data.content.matches)
      .filter(
        (item: CricketMatch) =>
          (item.internationalClassId !== null ||
            // item.state === "LIVE" ||
            MY_TEAMS_URL.includes(item.teams[0].team.slug) || //Is in My Teams
            MY_TEAMS_URL.includes(item.teams[1].team.slug) || //Is in My Teams
            SERIES_IDS.includes(item.series.objectId)) && //Is in My Series
          Date.parse(item.endDate) > Date.now() - 1000 * 60 * 60 * 24 * 1, //Keep games which have finished in the last day
      )
      .sort(compareCricketMatchDates) as CricketMatch[]
  );
}

export async function fetchCricketMatch(url: string) {
  let matchDetails =
    await scrapeNextData<CricinfoResponse<CricketMatchDetails>>(url);

  return matchDetails.props.appPageProps;
}

export async function fetchCricketSeriesMatches(url: string) {
  let data = await scrapeNextData<CricinfoResponse<CricketMatchResults>>(url);
  return data.props.appPageProps.data.content.matches;
}

export async function fetchCricketSeriesStandings(url: string) {
  let data = await scrapeNextData<CricinfoResponse<CricketSeriesResult>>(url);
  return data.props.appPageProps.data;
}
