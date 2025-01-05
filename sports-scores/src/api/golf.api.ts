import { scrapeNextData } from "@/lib/scraper";
import { PGALeaderboardPage } from "@/types/golf";

export async function fetchPGASchedule(year: string = "2025") {}

export async function fetchPGACurrentTournament() {
  let result = await fetchPGATournamentLeaderboard(
    "https://www.pgatour.com/leaderboard",
  );

  return result;
}

export async function fetchPGATournamentLeaderboard(url: string) {
  let result = await scrapeNextData<PGALeaderboardPage>(url);

  return result.props.pageProps;
}

/*
  Puppeteer Scraping functions
   */

// export async function fetchPGASchedule(year: string = "2025") {
//   let result = await scrapeExternalSite(
//     `https://www.pgatour.com/schedule/${year}`,
//     scrapePGASchedule,
//   );
//   console.log(result[0], result[5]);
// }

// export async function fetchPGACurrentTournament() {
//   let result = await scrapeExternalSite(
//     `https://www.pgatour.com/leaderboard`,
//     scrapePGALeaderboard,
//   );
//   console.log(result.players[0], result.players[5]);
// }

// export async function scrapePGASchedule(page: Page) {
//   return await page.evaluate(() => {
//     let temp: TournamentSummary[] = [];
//     const tournaments = document.querySelectorAll(".css-1bgfsqb"); //Get tournaments

//     tournaments.forEach((item) => {
//       temp.push({
//         name: item.querySelector(".css-vgdvwe")?.textContent ?? "NO NAME",
//         date: item.querySelector(".css-mi4td0")?.textContent ?? "JAN 0 - 0",
//         venue: item.querySelector(".css-16dpohb")?.textContent ?? "-",
//         location: item.querySelector(".css-p6cwm8")?.textContent ?? "-",
//         purse: item.querySelector(".css-zxbu3y")?.textContent ?? "$0",
//         fedexPoints: item.querySelector(".css-zxbu3y")?.textContent ?? "0",
//         winner: item.querySelector(".css-zxbu3y")?.textContent ?? "-",
//         url:
//           item
//             .querySelector(".css-1jfg7sy")
//             ?.getAttribute("href")
//             ?.split("?")[0] ?? "/",
//       });
//     });

//     return temp;
//   });
// }

// export async function scrapePGALeaderboard(page: Page) {
//   return await page.evaluate(() => {
//     let temp: Leaderboard = {
//       name: document.querySelector(".css-axbyz4")?.textContent ?? "NO NAME",
//       status: `${document.querySelector(".css-1io1rfd")?.textContent} - ${document.querySelector(".css-cs7o0s")?.textContent}`,
//       players: [],
//     };
//     const players = document.querySelectorAll(".css-1qtrmek"); //Get players

//     players.forEach((item) => {
//       let playerInfo = item.querySelectorAll(".css-1dmexvw");
//       temp.players.push({
//         position: item.querySelector(".css-1psnea4")?.textContent ?? "-",
//         name: item.querySelector(".css-hmig5c")?.textContent ?? "-",
//         total: item.querySelector(".css-18zsow2")?.textContent ?? "-",
//         through: playerInfo[0].textContent ?? "",
//         roundScore: playerInfo[1].textContent ?? "",
//         r1: playerInfo[2].textContent ?? "",
//         r2: playerInfo[3].textContent ?? "",
//         r3: playerInfo[4].textContent ?? "",
//         r4: playerInfo[5].textContent ?? "",
//         projFedex: playerInfo[7].textContent ?? "",
//       });
//     });

//     return temp;
//   });
// }
