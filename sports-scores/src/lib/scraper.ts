import {
  CricinfoResponse,
  CricketImage,
  CricketMatch,
  MatchDetails,
  MatchResults,
  Series,
  SeriesResults,
} from "@/types/cricket";
import { writeFile } from "fs";
import { REVALIDATE } from "./constants";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const fetchOptions = {
  // cache: 'no-store',
  next: { revalidate: REVALIDATE },
};

async function scrapeData<T>(url: string) {
  const response = await fetch(url, fetchOptions);

  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const scriptNode = document.querySelector("#__NEXT_DATA__");

  const jsonData = JSON.parse(scriptNode?.innerHTML ?? "");
  //   console.log(jsonData);
  return jsonData as T;
}

async function scrapePages(urls: string[]) {
  return (
    await Promise.all(
      urls.map(async (item) => {
        let data = await scrapeData<CricinfoResponse<MatchResults>>(item);
        return data.props.appPageProps.data.content.matches;
      }),
    )
  ).flat();
}

function compareCricketMatchDates(a: CricketMatch, b: CricketMatch) {
  let first = Date.parse(a.startTime);
  let second = Date.parse(b.startTime);
  if (first > second) {
    return 1;
  } else if (first < second) {
    return -1;
  }
  return 0;
}

function compareCricketSeriesDatesOLD(a: Series, b: Series) {
  let first = Date.parse(a.startDate);
  let second = Date.parse(b.startDate);
  if (first > second) {
    return 1;
  } else if (first < second) {
    return -1;
  }
  return 0;
}

function compareCricketSeriesDates(
  a: { title: string; series: Series; images: CricketImage[] },
  b: { title: string; series: Series; images: CricketImage[] },
) {
  let first = Date.parse(a.series.startDate);
  let second = Date.parse(b.series.startDate);
  if (first > second) {
    return 1;
  } else if (first < second) {
    return -1;
  }
  return 0;
}

export async function cricinfoTeamsScraper() {
  let teams = [
    "australia-2",
    "australia-women-238",
    "brisbane-heat-509668",
    "brisbane-heat-women-896397",
    "queensland-459",
    "queensland-women-476",
    "australia-a-women-217",
  ];

  let urls = teams.map((item) =>
    "https://www.espncricinfo.com/team/".concat(
      item,
      "/match-schedule-fixtures-and-results",
    ),
  );

  let bulkData = await scrapePages(urls);
  return bulkData
    .filter(
      (item) =>
        Date.parse(item.endDate) > Date.now() - 1000 * 60 * 60 * 24 * 90, //Keep matches that are <=90 days old
    )
    .sort(compareCricketMatchDates);
}

export async function cricinfoAllSeriesScraper() {
  let rawData = await scrapeData<CricinfoResponse<SeriesResults>>(
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

export async function cricinfoLiveMatchesScraper() {
  let liveMatches = await scrapeData<CricinfoResponse<any>>( //TODO: Define response type
    "https://www.espncricinfo.com/live-cricket-score",
  );

  // let upcomingMatches = await scrapeData<CricinfoResponse<any>>( //TODO: Define response type
  //   "https://www.espncricinfo.com/live-cricket-match-schedule-fixtures",
  // );

  // let pastMatches = await scrapeData<CricinfoResponse<any>>(
  //   "https://www.espncricinfo.com/live-cricket-match-results",
  // );

  return (
    liveMatches.props.appPageProps.data.content.matches
      // .concat(upcomingMatches.props.appPageProps.data.data.content.matches)
      // .concat(pastMatches.props.appPageProps.data.data.content.matches)
      .filter(
        (item: CricketMatch) =>
          item.internationalClassId !== null || item.state === "LIVE",
      )
      .sort(compareCricketMatchDates)
  );
}

export async function cricinfoMatchDetails(url: string) {
  let matchDetails = await scrapeData<CricinfoResponse<MatchDetails>>(url);

  return matchDetails.props.appPageProps.data;
}

export async function cricinfoSeriesScraper(url: string) {
  let data = await scrapeData<CricinfoResponse<MatchResults>>(url);
  return data.props.appPageProps.data.content.matches;
}

async function testing() {
  let upcomingMatches = await scrapeData<CricinfoResponse<MatchDetails>>(
    "https://www.espncricinfo.com/series/australia-a-women-vs-india-a-women-2024-1443790/australia-a-women-vs-india-a-women-2nd-match-1443798/full-scorecard",
  );

  writeFile("_espnTest", JSON.stringify(upcomingMatches), (err) => {});
}

// testing();
