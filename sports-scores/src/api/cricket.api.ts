import { mapCricketFixtureFields } from "@/lib/dataMapping";
import { SportsmonksCricket } from "@/types/misc";

const REVALIDATE = 10000; //TODO: change for deployment

const fetchOptions = {
  next: { revalidate: REVALIDATE },
};

export async function fetchCricketFixtures(startDate: string, endDate: string) {
  // startDate/endDate format = yyyy-mm-dd

  const rawFixtures = await fetch(
    `https://cricket.sportmonks.com/api/v2.0/fixtures?sort=starting_at&filter[starts_between]=${startDate},${endDate}&include=runs,venue,localteam,visitorteam&api_token=${process.env.SportsMonksAPIKey}`,
    fetchOptions,
  );

  let fixtures = (await rawFixtures.json()) as SportsmonksCricket;
  return mapCricketFixtureFields(fixtures.data);
}
