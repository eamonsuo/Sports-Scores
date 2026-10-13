"use client"

import ErrorPage from "@/components/misc-ui/ErrorPage"
import { usePathname } from "next/navigation"

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const sport = segments?.[1] ?? ""

  return <ErrorPage externalUrl={`https://www.google.com/search?q=${sport}`} />
}
