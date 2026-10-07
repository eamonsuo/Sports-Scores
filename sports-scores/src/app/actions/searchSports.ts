"use server"

import { fetchAllSportsSearchResults } from "@/endpoints/allsports.api"
import { SPORT } from "@/types/misc"

export async function searchSports(sport: SPORT, searchTerm: string) {
  return fetchAllSportsSearchResults(sport, searchTerm)
}
