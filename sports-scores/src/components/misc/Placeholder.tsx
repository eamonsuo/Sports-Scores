export default function Placeholder({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="h-full w-full px-4 pt-8 text-center">{children}</p>;
}
