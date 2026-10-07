import { fetchRapidApi } from "@/lib/projUtils"
import { SPORT } from "@/types/misc"
import { Sofascore_Search_Response } from "@/types/sofascore"

export async function fetchAllSportsApi<T>(endpoint: string) {
  return fetchRapidApi<T>(
    process.env.ALLSPORTS_BASEURL,
    endpoint,
    SPORT.DEFAULT_SPORT,
  )
}

export async function fetchAllSportsSearchResults(
  sport: SPORT,
  searchTerm: string,
  pageNumber: number = 0,
) {
  return fetchAllSportsApi<Sofascore_Search_Response>(
    `/${sport}/search/${searchTerm}?page=${pageNumber}`,
  )
}
