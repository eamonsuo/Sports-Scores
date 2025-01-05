import { CricinfoResponse, CricketMatchResults } from "@/types/cricket";
import puppeteer from "puppeteer";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export async function scrapeNextData<T>(url: string) {
  const response = await fetch(url);

  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const scriptNode = document.querySelector("#__NEXT_DATA__");

  const jsonData = JSON.parse(scriptNode?.innerHTML ?? "");
  //   console.log(jsonData);
  return jsonData as T;
}

export async function scrapeNextPages(urls: string[]) {
  return (
    await Promise.all(
      urls.map(async (item) => {
        let data =
          await scrapeNextData<CricinfoResponse<CricketMatchResults>>(item);
        return data.props.appPageProps.data.content.matches;
      }),
    )
  ).flat();
}

/* Puppeteer Scraping Function */
export async function scrapeSitePuppeteer(url: string, scrapeLogic: Function) {
  const browser = await puppeteer.launch({
    // headless: false,
    // devtools: true,
    // args: ["--start-maximized"],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1300, height: 820 });
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  console.log("PAGE LOAD");

  let result = await scrapeLogic(page);

  // console.log(result[0], result[5]);

  await browser.close();

  return result;
}

// async function scrapeNRLMatchData(page: Page) {
//   return await page.evaluate(() => {
//     let temp: NRLMatchSummary[] = [];
//     const matches = document.querySelectorAll(".match");

//     matches.forEach((item) => {
//       temp.push({
//         home: {
//           name: item.querySelector(".match-team__name--home")?.innerText,
//           score:
//             item
//               .querySelector(".match-team__score--home")
//               ?.innerText.split("\n")[1] ?? 0,
//         },
//         away: {
//           name: item.querySelector(".match-team__name--away")?.innerText,
//           score:
//             item
//               .querySelector(".match-team__score--away")
//               ?.innerText.split("\n")[1] ?? 0,
//         },
//         date: item.querySelector(".match-header__title")?.innerText,
//         status: item.querySelector(".match-clock")?.innerText ?? "",
//         venue:
//           item.querySelector(".match-venue")?.innerText.split("\n")[1] ?? "",
//         url:
//           item.querySelector(".match--highlighted")?.getAttribute("href") ?? "",
//       });
//     });

//     return temp;
//   });
// }
