import { MatchSummary } from "./misc";
import { Sofascore_CupTree } from "./sofascore";

export interface Football_FootApi_LeagueCupTrees_Response {
  cupTrees: Sofascore_CupTree[];
}

export interface FootballTeamFixturesPage {
  fixtures: MatchSummary[];
}
