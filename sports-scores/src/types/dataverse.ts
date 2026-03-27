// Generic OData response envelope
export interface DataverseResponse<T> {
  "@odata.context": string;
  value: T[];
}

// ss_matchsummary table
export interface DataverseMatchSummary {
  ss_matchsummaryid: string;
  ss_summarytext: string;
  ss_matchid: string | null;
  ss_startdate: string | null; // ISO date string
  ss_enddate: string | null; // ISO date string
  ss_sport: string | null;
  ss_venue: string | null;
  ss_status: 0 | 1 | 2 | null; // 0=LIVE, 1=UPCOMING, 2=COMPLETED
  ss_otherdetail: string | null;
  ss_homename: string | null;
  ss_homescore: string | null; // JSON: string | string[]
  ss_homeimg: string | null; // JSON: string | string[]
  ss_homewdl: string | null;
  ss_awayname: string | null;
  ss_awayscore: string | null; // JSON: string | string[]
  ss_awayimg: string | null; // JSON: string | string[]
  ss_awaywdl: string | null;
  ss_roundlabel: string | null;
  ss_timer: string | null;
  ss_timerdisplaycolour: 0 | 1 | 2 | null; // 0=Green, 1=Yellow, 2=Gray
  ss_seriesname: string | null;
  ss_matchslug: string | null;
  ss_seriesslug: string | null;
  ss_winner: number | null;
  ss_tournamentid: string | null;
  ss_seasonid: string | null;
}

// ss_sporteventschedule table
export interface DataverseSportEvent {
  ss_sporteventscheduleid: string;
  ss_name: string | null;
  ss_sport: string | null;
  ss_event_type: 100000000 | 100000001 | null; // 100000000=major, 100000001=regular-season
  ss_start_date: string | null; // ISO date string
  ss_end_date: string | null; // ISO date string
  ss_date_display: string | null;
  ss_image_url: string | null;
  ss_link: string | null;
  ss_location: string | null;
  ss_tags: string | null; // JSON array
  ss_notes: string | null;
}

// Standard Dataverse Contact entity
export interface DataverseContact {
  contactid: string;
  firstname: string | null;
  lastname: string | null;
  fullname: string | null;
  emailaddress1: string | null;
  telephone1: string | null;
  jobtitle: string | null;
  companyname: string | null;
}
