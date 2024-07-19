import { CricketMatch, CricinfoResponse, LiveScores } from "@/types/cricket";
import { writeFile } from "fs";
import { REVALIDATE } from "./constants";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const fetchOptions = {
  // cache: 'no-store',
  next: { revalidate: REVALIDATE },
};

export async function cricinfoScraper(): Promise<CricketMatch[]> {
  const response = await fetch(
    "https://www.espncricinfo.com/team/australia-2/match-schedule-fixtures-and-results",
    fetchOptions,
  );
  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const scriptNode = document.querySelector("#__NEXT_DATA__");

  const jsonData = JSON.parse(scriptNode?.innerHTML ?? "");
  const typed = jsonData.props as CricinfoResponse<LiveScores>;

  return typed.appPageProps.data.content.matches.filter(
    (item) => item.internationalClassId !== null,
  );
}

async function testing() {
  const response = await fetch(
    "https://www.espncricinfo.com/team/australia-2/match-schedule-fixtures-and-results",
    fetchOptions,
  );
  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const scriptNode = document.querySelector("#__NEXT_DATA__");

  const jsonData = JSON.parse(scriptNode?.innerHTML ?? "");
  //   console.log(jsonData);
  const typed = jsonData.props;
  writeFile("_espnTest", JSON.stringify(jsonData.props), (err) => {});
}

// testing();
