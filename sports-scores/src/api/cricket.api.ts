import { REVALIDATE } from "@/lib/constants";
// import { mapCricketFixtureFields } from "@/lib/dataMapping";
// import { SportsmonksCricket } from "@/types/misc";

const fetchOptions = {
  next: { revalidate: REVALIDATE },
};

export async function fetchCricketFixtures(startDate: string, endDate: string) {
  // const DAYSINPAST = 30; // Get records 30 days in the past
  // const YEARSINFUTURE = 1; // Get records 1 year in the future

  // const currentDate = new Date(Date.now());
  // const queryStartDate = new Date(currentDate);
  // queryStartDate.setDate(queryStartDate.getDate() - DAYSINPAST);
  // const queryEndDate = new Date(queryStartDate);
  // queryEndDate.setFullYear(queryEndDate.getFullYear() + YEARSINFUTURE);

  // let startDate = `${queryStartDate.getFullYear()}-${
  //   queryStartDate.getMonth() + 1
  // }-${queryStartDate.getDate()}`;
  // let endDate = `${queryEndDate.getFullYear()}-${
  //   queryEndDate.getMonth() + 1
  // }-${queryEndDate.getDate()}`;
  // startDate/endDate format = yyyy-mm-dd

  // const rawFixtures = await fetch(
  //   `https://cricket.sportmonks.com/api/v2.0/fixtures?sort=starting_at&filter[starts_between]=${startDate},${endDate}&include=runs,venue,localteam,visitorteam&api_token=${process.env.SportsMonksAPIKey}`,
  //   fetchOptions,
  // );

  // let fixtures = (await rawFixtures.json()) as SportsmonksCricket;
  // return mapCricketFixtureFields(fixtures.data);
  return [];
}
