import {
  CricketMatch,
  CricinfoResponse,
  MatchResults,
  SeriesResults,
  Series,
  CricketImage,
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

function compareCricketSeriesDates(a: Series, b: Series) {
  let first = Date.parse(a.startDate);
  let second = Date.parse(b.startDate);
  if (first > second) {
    return 1;
  } else if (first < second) {
    return -1;
  }
  return 0;
}

function compareCricketSeriesDatesType2(
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
  return bulkData.sort(compareCricketMatchDates);
}

export async function cricinfoSeriesScraper() {
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
      (item) =>
        Date.parse(item.series.endDate) > Date.now() - 1000 * 60 * 60 * 24 * 30, //Filter out series more than 30 days old
    );
    item.items.sort(compareCricketSeriesDatesType2);
  });

  return combinedSeries;
}

export async function cricinfoRecentMatchesScraper() {
  let upcomingMatches = await scrapeData<CricinfoResponse<any>>(
    "https://www.espncricinfo.com/live-cricket-match-schedule-fixtures",
  );

  // let pastMatches = await scrapeData<CricinfoResponse<any>>(
  //   "https://www.espncricinfo.com/live-cricket-match-results",
  // );

  return (
    upcomingMatches.props.appPageProps.data.data.content.matches
      // .concat(pastMatches.props.appPageProps.data.data.content.matches)
      .filter((item: CricketMatch) => item.internationalClassId !== null)
      .sort(compareCricketMatchDates)
  );
}

async function testing() {
  let rawData = await scrapeData<CricinfoResponse<SeriesResults>>(
    "https://www.espncricinfo.com/cricket-fixtures",
  );

  let series = rawData.props.appPageProps.data.collections.flatMap(
    (item) => item.seriesGroups,
  );

  let combinedSeries: typeof series = [];

  for (const s of series) {
    let duplicate = false;
    for (const com of combinedSeries) {
      if (s.title === com.title) {
        // console.log(com.items.length);
        com.items = com.items.concat(s.items);
        // console.log(com.items.length);
        duplicate = true;
        break;
      }
    }
    !duplicate && combinedSeries.push(s);
  }

  combinedSeries.map((item) => item.items.sort(compareCricketSeriesDatesType2));

  // series = series.filter(
  //   (value, index, self) =>
  //     index === self.findIndex((t) => t.name === value.name),
  // );

  writeFile("_espnTest", JSON.stringify(combinedSeries), (err) => {});
}

// testing();
