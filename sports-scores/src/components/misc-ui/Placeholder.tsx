export default function Placeholder({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p className="h-full w-full px-4 pt-8 text-center text-neutral-200">
      {children}
    </p>
  )
}
