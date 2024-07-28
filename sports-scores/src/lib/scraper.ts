import {
  CricketMatch,
  CricinfoResponse,
  MatchResults,
  SeriesResults,
  Series,
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

  let series = rawData.props.appPageProps.data.collections.flatMap((type) =>
    type.seriesGroups.flatMap((group) =>
      group.items.flatMap((item) => item.series),
    ),
  );

  series = series.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.name === value.name),
  );

  return series.sort(compareCricketSeriesDates);
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
  let series = await scrapeData<CricinfoResponse<SeriesResults>>(
    "https://www.espncricinfo.com/cricket-fixtures",
  );

  let urls = series.props.appPageProps.data.collections.flatMap((type) =>
    type.seriesGroups.flatMap((group) => group.items.flatMap((item) => item)),
  );

  writeFile(
    "_espnTest",
    JSON.stringify(await cricinfoSeriesScraper()),
    (err) => {},
  );
}

testing();
