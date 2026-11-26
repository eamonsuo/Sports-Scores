// Generic OData response envelope
export interface DataverseResponse<T> {
  "@odata.context": string
  value: T[]
}

type DataverseLookup<T extends string> = {
  [K in `_${T}_value`]?: string
} & {
  [K in `_${T}_value@OData.Community.Display.V1.FormattedValue`]?: string
} & {
  [
    K in `_${T}_value@Microsoft.Dynamics.CRM.associatednavigationproperty`
  ]?: string
} & {
  [K in `_${T}_value@Microsoft.Dynamics.CRM.lookuplogicalname`]?: string
}

// ss_matchsummary table
export interface DataverseMatchSummary {
  ss_matchsummaryid: string
  ss_summarytext: string
  ss_matchid: string | null
  ss_startdate: string | null // ISO date string
  ss_enddate: string | null // ISO date string
  ss_sport: string | null
  ss_venue: string | null
  ss_status: 0 | 1 | 2 | null // 0=LIVE, 1=UPCOMING, 2=COMPLETED
  ss_otherdetail: string | null
  ss_competitordetails: string | null // JSON: TeamScoreDetails[]
  ss_roundlabel: string | null
  ss_timer: string | null
  ss_timerdisplaycolour: 0 | 1 | 2 | null // 0=Green, 1=Yellow, 2=Gray
  ss_leaguename: string | null
  ss_leagueimg: string | null
  ss_leagueslug: string | null
  ss_matchslug: string | null
  ss_winner: number | null
  ss_leagueid: string | null
  ss_seasonid: string | null
  ss_cardvariant: string | null
  ss_tv: string | null // JSON: TVDetails[]
}

// ss_sporteventschedule table
export interface DataverseSportEvent {
  ss_sporteventscheduleid: string
  ss_name: string | null
  ss_sport: string | null
  ss_event_type: 100000000 | 100000001 | null // 100000000=major, 100000001=regular-season
  ss_start_date: string | null // ISO date string
  ss_end_date: string | null // ISO date string
  ss_date_display: string | null
  ss_image_url: string | null
  ss_link: string | null
  ss_location: string | null
  ss_tags: string | null // JSON array
  ss_notes: string | null
  ss_tv: string | null // JSON: TVDetails[]
}

// Standard Dataverse Contact entity
export interface DataverseContact {
  contactid: string
  firstname: string | null
  lastname: string | null
  fullname: string | null
  emailaddress1: string | null
  telephone1: string | null
  jobtitle: string | null
  companyname: string | null
}

export type DataverseSport = {
  ss_sportid: string
  ss_name: string | null
  ss_slug: string | null
  ss_sofascoreendpoint: string | null

  // Expands
  ss_league_sportid_ss_sport?: DataverseLeague[]
  ss_category_sportid_ss_sport?: DataverseCategory[]
}

export type DataverseCategory = {
  ss_categoryid: string
  ss_name: string | null
  ss_slug: string | null
  ss_excludefromtoday: boolean
  ss_sport: string | null

  // Expands
  // ss_league_sportid_ss_sport?: DataverseLeague[]
} & DataverseLookup<"ss_sportid"> // Lookup to DataverseSport

export type DataverseLeague = {
  ss_leagueid: string
  ss_name: string | null
  ss_slug: string | null
  ss_icon: string | null
  ss_display: string | null
  ss_externalurl: string | null
  ss_excludefromtoday: boolean
  ss_hidden: boolean

  // Expands
  ss_season_leagueid_ss_league?: DataverseSeason[]
} & DataverseLookup<"ss_sportid"> &
  DataverseLookup<"ss_categoryid"> // Lookup to DataverseSport and DataverseCategory

export type DataverseSeason = {
  ss_seasonid: string
  ss_name: string | null
  ss_slug: string | null
  ss_externalurl: string | null
  ss_byes: string | null // JSON array of byes
} & DataverseLookup<"ss_leagueid"> & // Lookup to DataverseLeague
  DataverseLookup<"ss_ladderconfigid"> & // Lookup to DataverseLadderConfig
  DataverseLookup<"ss_playoffpictureconfigid"> & // Lookup to DataversePlayoffPictureConfig
  DataverseLookup<"ss_tvconfigid"> // Lookup to DataverseTVConfig

export type DataverseLadderConfig = {
  ss_ladderconfigid: string
  ss_name: string | null
  ss_headings: string | null

  // Expands
  ss_laddergroupconfig_ladderconfigid_ss_ladderconfig?: DataverseLadderGroupConfig[]
}

export type DataverseLadderGroupConfig = {
  ss_laddergroupconfigid: string
  ss_label: string | null
  ss_headings: string | null
  ss_placingcategories: string | null
  ss_filtercondition: string | null // JSON array of byes
  ss_filters: string | null // JSON array of byes
} & DataverseLookup<"ss_ladderconfigid">

export type DataversePlayoffPictureConfig = {
  ss_playoffpictureconfigid: string
  ss_name: string | null
  ss_rankingsystem: string | null
  ss_totalseasongames: number | null
  ss_qualifyingpositions: number | null
  ss_pointsperdraw: number | null
  ss_pointsperwin: number | null
  ss_structure: string | null
}

export type DataverseTVConfig = {
  ss_tvconfigid: string
  ss_name: string | null
  ss_matchlength: number | null
  ss_channels: string | null
}
