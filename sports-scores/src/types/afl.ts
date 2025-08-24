import { RoundDetails } from "./misc";

export interface AussieRulesFixturesPage {
  fixtures: RoundDetails[];
  currentRound: string;
}

export interface AussieRulesLadderPage {
  standings: AussieRulesStanding[];
}

export type AussieRulesGameEvents = {
  game: {
    id: number;
  };
  events: [
    {
      team: {
        id: number;
      };
      player: {
        id: number;
      };
      period: number;
      minute: number;
      type: "goal" | "behind";
    },
  ];
};

export type AussieRulesStanding = {
  position: number;
  team: {
    id: number;
    name: string;
    logo?: string;
  };
  pts: number;
  games: {
    played: number;
    win: number;
    drawn: number;
    lost: number;
  };
  scores: {
    for: number;
    against: number;
  };
  last_5: string;
};
