import { SPORT } from "@/lib/constants";
import { setMatchStatusCricket } from "../lib/utils";

const REVALIDATE = 10000; //TODO: change for deployment

const fetchOptions = {
  next: { revalidate: REVALIDATE },
};

export async function fetchCricketFixtures(startDate: string, endDate: string) {
  //startDate/endDate format = yyyy-mm-dd

  const rawFixtures = await fetch(
    `https://cricket.sportmonks.com/api/v2.0/fixtures?sort=starting_at&filter[starts_between]=${startDate},${endDate}&include=runs,venue,localteam,visitorteam&api_token=${process.env.SportsMonksAPIKey}`,
    fetchOptions,
  );

  let fixtures = (await rawFixtures.json()) as SportsmonksCricket;
  return mapCricketFixtureFields(fixtures.data);
}

export async function fetchCricketStatus() {
  return {};
}

// export async function fetchAFLStandings(season: string) {
//   const rawStandings = await fetch(
//     `${process.env.AFL_BASEURL}/standings?season=${season}&league=1`,
//     fetchOptions
//   );

//   let standings = await rawStandings.json();
//   return standings;
// }

function mapCricketFixtureFields(matches: SportsmonksMatchCricket[]) {
  return matches.map((item: SportsmonksMatchCricket) => ({
    id: item.id,
    startDate: item.starting_at,
    gameid: item.id,
    sport: SPORT.CRICKET,
    venue: `${item.venue?.name}, ${item.venue?.city}`,
    status: setMatchStatusCricket(item.status),
    summary:
      item.status === "NS"
        ? `Starts at ${new Date(item.starting_at).toLocaleTimeString()} `
        : item.note,
    otherDetail: item.round,
    homeDetails: {
      img: item.localteam.image_path,
      score: `${item.runs[0]?.wickets ? item.runs[0]?.wickets : "0"}/${
        item.runs[0]?.score ? item.runs[0]?.score : "0"
      }`,
      name: item.localteam.name,
    },
    awayDetails: {
      img: item.visitorteam.image_path,
      score: `${item.runs[1]?.wickets ? item.runs[1]?.wickets : "0"}/${
        item.runs[1]?.score ? item.runs[1]?.score : "0"
      }`,
      name: item.visitorteam.name,
    },
  }));
}
