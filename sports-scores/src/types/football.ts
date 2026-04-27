import { Match as BracketMatch } from "@/components/bracket/types";
import { MatchSummary } from "./misc";
import { Sofascore_CupTree } from "./sofascore";

export interface Football_FootApi_LeagueCupTrees_Response {
  cupTrees: Sofascore_CupTree[];
}

export interface FootballTeamFixturesPage {
  fixtures: MatchSummary[];
}

export interface FootballBracketPage {
  brackets: {
    id: number;
    name: string;
    currentRound: number;
    matches: BracketMatch[];
  }[];
}

export interface BracketRounds {
  id: number;
  name: string;
  matches: MatchSummary[];
}
