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
