export const dynamic = "force-dynamic";

export default async function Page() {
  // const scrape = await fetchCricketCurrentMatches();

  // const fixtures = mapScrape(scrape);

  // return <CricketFixtureList data={fixtures} />;
  return (
    <iframe
      src="https://www.google.com/search?igu=1&gws_rd=ssl&q=cricket"
      className="w-full flex-1"
    />
  );
}
