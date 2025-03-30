import puppeteer from "puppeteer";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/* Scrape NextJS Functions */
export async function scrapeNextData<T>(url: string) {
  const response = await fetch(url);

  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const scriptNode = document.querySelector("#__NEXT_DATA__");

  const jsonData = JSON.parse(scriptNode?.innerHTML ?? "");
  return jsonData as T;
}

export async function scrapeNextPages(urls: string[]) {
  return (
    await Promise.all(
      urls.map(async (item) => {
        let data = await scrapeNextData<any>(item);
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

  let result = await scrapeLogic(page);

  await browser.close();

  return result;
}
