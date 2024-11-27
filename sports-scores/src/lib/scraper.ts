import {
  CricinfoResponse,
  CricketMatchResults,
  CricketSeriesResult,
} from "@/types/cricket";
import { writeFile } from "fs";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export async function scrapeData<T>(url: string) {
  const response = await fetch(url);

  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const scriptNode = document.querySelector("#__NEXT_DATA__");

  const jsonData = JSON.parse(scriptNode?.innerHTML ?? "");
  //   console.log(jsonData);
  return jsonData as T;
}

export async function scrapePages(urls: string[]) {
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

// testing();
