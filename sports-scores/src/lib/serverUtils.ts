import { TZDate } from "@date-fns/tz"
import { cacheLife } from "next/cache"
import { cookies } from "next/headers"

export async function getClientTimezone(): Promise<string> {
  const cookieStore = await cookies()
  const tz = cookieStore.get("clientTimezone")?.value
  return tz ? decodeURIComponent(tz) : "UTC"
}

export async function getClientDate(): Promise<TZDate> {
  "use cache: private"
  cacheLife("seconds")

  const timezone = await getClientTimezone()
  return new TZDate(new Date(), timezone)
}
