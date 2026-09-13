import { fetchRapidApi } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"

export async function fetchAllsportsApi<T>(endpoint: string) {
  return fetchRapidApi<T>(
    process.env.ALLSPORTS_BASEURL,
    endpoint,
    SPORT.DEFAULT_SPORT,
  )
}
