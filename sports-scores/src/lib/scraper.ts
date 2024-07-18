import { CricketMatch, CricinfoResponse } from "@/types/cricket";
import { writeFile } from "fs";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const REVALIDATE = 1; //TODO: change for deployment

const fetchOptions = {
  // cache: 'no-store',
  next: { revalidate: REVALIDATE },
};

export async function cricinfoScraper(): Promise<CricketMatch[]> {
  const response = await fetch(
    "https://www.espncricinfo.com/live-cricket-score",
    fetchOptions,
  );
  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const scriptNode = document.querySelector("#__NEXT_DATA__");

  const jsonData = JSON.parse(scriptNode?.innerHTML ?? "");
  //   console.log(jsonData);
  const typed = jsonData.props as CricinfoResponse;
  writeFile("_espnTest", JSON.stringify(jsonData.props), (err) => {});

  return typed.appPageProps.data.content.matches.filter(
    (item) => item.internationalClassId !== null,
  );
}
