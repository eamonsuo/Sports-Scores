import MatchDetailsHero from "../generic/MatchDetailsHero";
import CricketMatchSummary from "./CricketMatchSummary";

export type MatchDetailsPage = {
  matchSummaryText: string;
  status: string;
  date: string;
  venue: string;
  tossResult: string;
  umpires: string[];
  pom: string;
  homeInfo: {
    img?: string;
    name: string;
    score: string;
  };
  awayInfo: {
    img?: string;
    name: string;
    score: string;
  };
  homePlayers: string[];
  awayPlayers: string[];
};

export default function CricketMatchDetailsPage({
  matchDetails,
}: {
  matchDetails: MatchDetailsPage;
}) {
  return (
    <>
      <p className="my-2 text-center text-xl text-neutral-400">
        {matchDetails.matchSummaryText}
      </p>
      <MatchDetailsHero
        status={matchDetails.status}
        homeInfo={matchDetails.homeInfo}
        awayInfo={matchDetails.awayInfo}
      />
      {/* TODO: add live batter/bowler scores */}
      <CricketMatchSummary
        date={matchDetails.date}
        venue={matchDetails.venue}
        toss={matchDetails.tossResult}
        homePlayers={matchDetails.homePlayers}
        awayPlayers={matchDetails.awayPlayers}
        umpires={matchDetails.umpires}
        pom={matchDetails.pom}
      />
    </>
  );
}
