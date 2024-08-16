export default function Placeholder({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="h-full w-full pt-8 text-center">{children}</p>;
}
