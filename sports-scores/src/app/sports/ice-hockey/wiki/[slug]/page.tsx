export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  return (
    <iframe
      src={`https://en.wikipedia.org/wiki/${slug}`}
      title="Wikipedia Page"
      className="h-screen w-full border-0"
    />
  );
}
