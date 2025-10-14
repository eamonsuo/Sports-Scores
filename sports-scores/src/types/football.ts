interface FootballLive_AllLeagueFixtures {
  status: string;
  response: { matches: FootballLive_Matches[] };
}

interface FootballLive_Matches {
  //...
}

interface FootballLive_StandingsResponse {
  status: string;
  response: { standings: FootballLive_Standings[] };
}

interface FootballLive_Standings {
  //...
}
