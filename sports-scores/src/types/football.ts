interface FootballLive_AllLeagueFixtures_Response {
  status: string;
  response: { matches: FootballLive_Matches[] };
}

interface FootballLive_Matches {
  //...
}

interface FootballLive_Standings_Response {
  status: string;
  response: { standings: FootballLive_Standings[] };
}

interface FootballLive_Standings {
  //...
}
