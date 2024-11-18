import {
  CricinfoResponse,
  CricketAllSeriesResults,
  CricketImage,
  CricketMatch,
  CricketMatchDetails,
  CricketMatchResults,
  CricketSeries,
  CricketSeriesResult,
} from "@/types/cricket";
import { writeFile } from "fs";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const fetchOptions = {
  // cache: 'no-store',
  // next: { revalidate: REVALIDATE },
};

export async function scrapeData<T>(url: string) {
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
        let data =
          await scrapeData<CricinfoResponse<CricketMatchResults>>(item);
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

function compareCricketSeriesDatesOLD(a: CricketSeries, b: CricketSeries) {
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
  a: { title: string; series: CricketSeries; images: CricketImage[] },
  b: { title: string; series: CricketSeries; images: CricketImage[] },
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
  let rawData = await scrapeData<CricinfoResponse<CricketAllSeriesResults>>(
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

  let pastMatches = await scrapeData<CricinfoResponse<any>>(
    "https://www.espncricinfo.com/live-cricket-match-results",
  );

  return (
    liveMatches.props.appPageProps.data.content.matches
      // .concat(upcomingMatches.props.appPageProps.data.data.content.matches)
      .concat(pastMatches.props.appPageProps.data.data.content.matches)
      .filter(
        (item: CricketMatch) =>
          (item.internationalClassId !== null ||
            item.state === "LIVE" ||
            item.series.objectId === 1445395 || //Darwin T20 Series
            item.series.objectId === 1445044 || //T20 Spring Series (Pre WBBL)
            item.series.objectId === 1442625 || //WBBL
            item.series.objectId === 1443056 || //BBL
            item.series.objectId === 1444468 || //Sheffield Shield
            item.series.objectId === 1444469 || //One Day Cup (Men Domestic)
            item.series.objectId === 1445042) && //WNCL
          Date.parse(item.endDate) > Date.now() - 1000 * 60 * 60 * 24 * 1, //Keep games which have finished in the last day
      )
      .sort(compareCricketMatchDates) as CricketMatch[]
  );
}

export async function cricinfoMatchDetails(url: string) {
  let matchDetails =
    await scrapeData<CricinfoResponse<CricketMatchDetails>>(url);

  return matchDetails.props.appPageProps;
}

export async function cricinfoSeriesMatchesScraper(url: string) {
  let data = await scrapeData<CricinfoResponse<CricketMatchResults>>(url);
  return data.props.appPageProps.data.content.matches;
}

export async function cricinfoSeriesStandingsScraper(url: string) {
  let data = await scrapeData<CricinfoResponse<CricketSeriesResult>>(url);
  return data.props.appPageProps.data;
}

async function testing() {
  let upcomingMatches = await scrapeData<CricinfoResponse<CricketSeriesResult>>(
    "https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2024-1411166",
  );

  writeFile(
    "_espnTest",
    JSON.stringify(upcomingMatches.props.appPageProps.data.content),
    (err) => {},
  );
}

testing();
