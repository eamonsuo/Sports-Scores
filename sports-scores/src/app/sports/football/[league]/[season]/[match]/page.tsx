export default async function MatchPage(props: {
  params: Promise<{ league: string; year: string; match: string }>;
}) {
  // You can fetch match data here using league, year, and match
  // If match is invalid, you can call notFound()
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Match: {(await props.params).match}
      </h1>
      <p>League: {(await props.params).league}</p>
      <p>Year: {(await props.params).year}</p>
      {/* Render match details here */}
    </div>
  );
}
