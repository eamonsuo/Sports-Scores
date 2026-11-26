import {
  createDataverseSport,
  fetchDataverseSports,
} from "@/endpoints/dataverse.api"
import { leaguesBySport, seasonsByLeague } from "@/services/dataverse.service"
import { DataverseSport } from "@/types/dataverse"
import { SPORT } from "@/types/misc"
import { loadEnvConfig } from "@next/env"

loadEnvConfig(process.cwd())

async function uploadSports() {
  console.log(`\nBulk uploading sports`)

  for (const sport of Object.keys(SPORT)) {
    console.log(`Uploading sport: ${sport}`)

    const newSport: Omit<DataverseSport, "ss_sportid"> = {
      ss_name: sport.replace("_", " ").toLocaleUpperCase(),
      ss_slug: SPORT[sport as keyof typeof SPORT],
      ss_sofascoreendpoint:
        process.env[`${sport}_BASEURL`]
          ?.replace("/api", "")
          ?.replace("https://", "") ?? null,
    }

    const res = await createDataverseSport(newSport)
    console.log(`Uploaded  - ${res}`)
  }
  console.log(`\nFinished bulk uploading sports`)
}

async function uploadLeagues(sport: SPORT) {
  console.log(`\nBulk uploading leagues for sport: ${sport}`)

  // get sport & leagues from db
  const dataverseSports = await fetchDataverseSports(
    `ss_slug eq '${sport}'`,
    "*",
    "",
    "ss_category_sportid_ss_sport($select=*),ss_league_sportid_ss_sport($select=*)",
  )

  console.log(`Dataverse sports fetched: ${dataverseSports?.value?.length}`)

  const sportId = dataverseSports?.value?.[0]?.ss_sportid

  // create other category & get guid
  const customCategory = {
    ss_name: "Other",
    ss_slug: "other",
    ss_excludefromtoday: false,
    "ss_sportid@odata.bind": `/ss_sports(${sportId})`,
  }

  const customCategoryID = "0000000000000000000000000" // await createDataverseRecord("ss_categories", customCategory)

  console.log(`Custom category created with ID: ${customCategoryID}`)

  // hardcode leagues
  const sportLeagues = await leaguesBySport(sport)

  console.log(`Sport leagues to upload: ${sportLeagues.length}`)

  // Get all current leagues for that sport
  const dataverseLeagues =
    dataverseSports?.value?.[0]?.ss_league_sportid_ss_sport

  console.log(`Dataverse leagues fetched: ${dataverseLeagues?.length}`)

  // Map ids to slugs for current leagues
  for (const oldLeague of sportLeagues ?? []) {
    const dataverseLeague = dataverseLeagues?.find(
      (league) => league.ss_slug === oldLeague.slug,
    )

    if (dataverseLeague) {
      console.log(`\nUpdating league: ${oldLeague.name}`)
      // League already exists in Dataverse, update
      const updatedLeague = {
        ss_externalurl: oldLeague.externalURL ?? dataverseLeague.ss_externalurl,
        ss_icon: oldLeague.icon ?? dataverseLeague.ss_icon,
        ss_display: oldLeague.display ?? dataverseLeague.ss_display,
        ss_name: oldLeague.name ?? dataverseLeague.ss_name,
      }
      // await updateDataverseRecord("ss_leagues", dataverseLeague.ss_leagueid, updatedLeague as Record<string, unknown>)

      // Get Seasons & update properties
      const dataverseSeasons = await seasonsByLeague(
        dataverseLeague.ss_leagueid,
      )

      console.log(
        `Fetched seasons for league ${oldLeague.name}: ${dataverseSeasons?.length}`,
      )

      for (const oldSeason of oldLeague.seasons ?? []) {
        const dataverseSeason = dataverseSeasons?.find(
          (season) => season.slug === oldSeason.slug,
        )

        if (dataverseSeason) {
          console.log(`Updating season: ${oldSeason.name}`)
          const updatedSeason = {
            ss_name: oldSeason.name ?? null,
            ss_slug: oldSeason.slug ?? null,
            ss_externalurl: oldSeason.externalURL ?? null,
            // ss_byes: JSON.stringify(oldLeague.byes) ?? null,
          }
          // await updateDataverseRecord("ss_seasons",dataverseSeason.dataverseGUID ?? "",updatedSeason as Record<string, unknown>)
        }
      }
    } else {
      // League does not exist in Dataverse, create it
      console.log(`\nCreating league: ${oldLeague.name}`)
      const createdLeague = {
        ss_name: oldLeague.name ?? null,
        ss_slug: oldLeague.slug ?? null,
        ss_excludefromtoday: oldLeague.excludeFromToday ?? false,
        ss_hidden: oldLeague.hidden ?? false,

        ss_externalurl: oldLeague.externalURL ?? null,
        ss_icon: oldLeague.icon ?? null,
        ss_display: oldLeague.display ?? null,
        "ss_sportid@odata.bind": `/ss_sports(${sportId})`,
        "ss_categoryid@odata.bind": `/ss_categories(${customCategoryID})`,
      }
      const newLeagueID = "0000000000000000000000" // await createDataverseRecord("ss_leagues", createdLeague)

      //Create season
      console.log(`Creating seasons for league: ${oldLeague.name}`)
      for (const oldSeason of oldLeague.seasons ?? []) {
        console.log(`Creating season: ${oldSeason.name}`)
        const createdSeason = {
          ss_name: oldSeason.name ?? null,
          ss_slug: oldSeason.slug ?? null,
          ss_externalurl: oldSeason.externalURL ?? null,
          // ss_byes: JSON.stringify(oldLeague.byes) ?? null,
          "ss_leagueid@odata.bind": `/ss_leagues(${newLeagueID})`,
        }
        // await createDataverseRecord("ss_seasons", createdSeason)
      }
    }
  }
  console.log(`Finished uploading leagues for sport: ${sport}`)
}

async function main() {
  // await uploadSports()
  for (const sport of Object.values(SPORT)) {
    // await uploadLeagues(sport)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
