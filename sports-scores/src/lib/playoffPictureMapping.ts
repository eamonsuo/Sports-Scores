import {
  PlayoffConference,
  PlayoffSection,
  PlayoffTeam,
} from "@/components/all-sports/PlayoffPicture";
import { Sofascore_Standing, Sofascore_StandingRow } from "@/types/sofascore";
import { resolveSportImage } from "./imageMapping";
import { shortenTeamNames } from "./projUtils";

export enum PLAYOFF_PICTURE_TYPE {
  TOP_8 = "top8",
  TOP_10 = "top10",
}

export type PlayoffPictureContext = {
  sofascoreStandings?: Sofascore_Standing[];
};

const PLAYOFF_PICTURE_MAP: Record<
  PLAYOFF_PICTURE_TYPE,
  (context: PlayoffPictureContext) => PlayoffConference[]
> = {
  [PLAYOFF_PICTURE_TYPE.TOP_8]: (ctx) =>
    ctx.sofascoreStandings ? top8PlayoffPicture(ctx.sofascoreStandings) : [],
  [PLAYOFF_PICTURE_TYPE.TOP_10]: () => [],
};

export function resolvePlayoffPicture(
  key: PLAYOFF_PICTURE_TYPE | undefined,
  context: PlayoffPictureContext | undefined,
) {
  if (!key || !context) return undefined;
  return PLAYOFF_PICTURE_MAP[key]?.(context);
}

function mapTeam(team: Sofascore_StandingRow): PlayoffTeam {
  return {
    name: shortenTeamNames(team.team.name),
    logo: resolveSportImage(team.team.name),
    seed: team.position,
  };
}

function top8PlayoffPicture(standings: Sofascore_Standing[]) {
  const finalsTeams = standings[0].rows.slice(0, 8);
  const teamsNotInFinals = standings[0].rows.slice(8);

  return [
    {
      conferenceMatches: [
        {
          title: "Qualifying Finals",
          teams: [
            [mapTeam(finalsTeams[0]), mapTeam(finalsTeams[3])],
            [mapTeam(finalsTeams[1]), mapTeam(finalsTeams[2])],
          ],
        },
        {
          title: "Elimination Finals",
          teams: [
            [mapTeam(finalsTeams[4]), mapTeam(finalsTeams[7])],
            [mapTeam(finalsTeams[5]), mapTeam(finalsTeams[6])],
          ],
        },
        ...getPlayoffStatus(finalsTeams, teamsNotInFinals),
      ],
    },
  ] as PlayoffConference[];
}

function getPlayoffStatus(
  finalsTeams: Sofascore_StandingRow[],
  teamsNotInFinals: Sofascore_StandingRow[],
) {
  const TotalGames = 24;

  const eliminatedTeams: PlayoffTeam[] = [];
  const inTheHuntTeams: PlayoffTeam[] = [];

  // Helper function to calculate maximum possible win percentage
  const calculateMaxPoints = (team: Sofascore_StandingRow) => {
    const gamesRemaining = TotalGames - Number(team.matches);
    const maxWins = Number(team.wins) + gamesRemaining;
    return calculatePoints(maxWins, Number(team.draws));
  };

  // Helper function to calculate win percentage
  const calculateCurrentPoints = (team: Sofascore_StandingRow) => {
    if (Number(team.matches) === 0) return 0;
    return calculatePoints(Number(team.wins), Number(team.draws));
  };

  // Helper function to calculate win percentage
  const calculatePoints = (won: number, draws: number) => {
    return won * 2 + draws;
  };

  // Find the lowest win percentage among the finals teams
  const minFinalsPoints = Math.min(
    ...finalsTeams.map((team) => calculateCurrentPoints(team)),
  );

  teamsNotInFinals.forEach((team) => {
    const maxPossiblePoints = calculateMaxPoints(team);

    // Check 1: Can they catch the worst finals team?
    maxPossiblePoints >= minFinalsPoints
      ? inTheHuntTeams.push(mapTeam(team))
      : eliminatedTeams.push(mapTeam(team));
  });

  return [
    { title: "In the Hunt", teams: inTheHuntTeams },
    { title: "Eliminated", teams: eliminatedTeams },
  ] as PlayoffSection[];
}
