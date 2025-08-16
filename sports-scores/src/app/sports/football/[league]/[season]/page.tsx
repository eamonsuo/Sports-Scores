export default async function LeagueseasonPage(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  // You can fetch league/season data here
  // If league/season is invalid, you can call notFound()
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">
        {(await props.params).league} - {(await props.params).season}
      </h1>
      {/* Render league/season overview, standings, etc. */}
    </div>
  );
}
