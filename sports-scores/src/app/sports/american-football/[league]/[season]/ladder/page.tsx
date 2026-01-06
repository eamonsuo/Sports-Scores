import AmericanFootballLadder, {
  AmericanFootballStanding,
  AmericanFootballTeamStanding,
} from "@/components/american-football/AmericanFootballLadder";
import type { PlayoffPictureProps } from "@/components/american-football/PlayoffPicture";
import PlayoffPicture from "@/components/american-football/PlayoffPicture";
import Placeholder from "@/components/misc/Placeholder";
import { americanFootballStandings } from "@/services/american-football.service";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ league: string; season: string }>;
}) {
  const { league, season } = await props.params;
  const pageData = await americanFootballStandings(
    Number(league),
    Number(season),
  );

  if (pageData === null) {
    return <Placeholder>NO DATA</Placeholder>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {league === "9464" && (
        <PlayoffPicture {...getNFLPlayoffPicture(pageData.tables)} />
      )}
      {pageData.tables.map((item) => (
        <AmericanFootballLadder key={item.tableName} data={item} />
      ))}
    </div>
  );
}

function getNFLPlayoffPicture(NFLTables: AmericanFootballStanding[]) {
  // --------- AFC ------------
  const afcStandings =
    NFLTables.find((t) => t.tableName === "NFL 25/26, AFC")?.standings ?? []; //Get the conference standings

  const afcWildCards = afcStandings.slice(4, 7) ?? []; // Get wild card teams (pos 5-7)

  const afcInHunt = afcStandings.slice(7) ?? [];

  // Get AFC division tables for divisional playoff checks
  const afcDivisionTables = NFLTables.filter(
    (t) => t.tableName.includes("AFC") && t.tableName !== "NFL 25/26, AFC",
  );

  const afcNonPlayoff = getPlayoffStatus(
    afcInHunt,
    afcWildCards,
    afcDivisionTables,
  );

  // --------- NFC ------------
  const nfcStandings =
    NFLTables.find((t) => t.tableName === "NFL 25/26, NFC")?.standings ?? []; //Get the conference standings

  const nfcWildCards = nfcStandings.slice(4, 7) ?? []; // Get wild card teams (pos 5-7)

  const nfcInHunt = nfcStandings.slice(7) ?? [];

  // Get NFC division tables for divisional playoff checks
  const nfcDivisionTables = NFLTables.filter(
    (t) => t.tableName.includes("NFC") && t.tableName !== "NFL 25/26, NFC",
  );

  const nfcNonPlayoff = getPlayoffStatus(
    nfcInHunt,
    nfcWildCards,
    nfcDivisionTables,
  );

  // -------- Combine Results ------------
  function mapTeams(team: AmericanFootballTeamStanding, seedOverride?: number) {
    return {
      name: team.team.name,
      seed: seedOverride ?? team.position,
      logo: team.team.logo,
    };
  }

  return {
    afc: {
      divisional: mapTeams(afcStandings[0], 1),
      wildCard: [
        [mapTeams(afcStandings[1], 2), mapTeams(afcWildCards[2], 7)],
        [mapTeams(afcStandings[2], 3), mapTeams(afcWildCards[1], 6)],
        [mapTeams(afcStandings[3], 4), mapTeams(afcWildCards[0], 5)],
      ],
      inHunt: afcNonPlayoff.inTheHunt.map(mapTeams) ?? [],
      eliminated: afcNonPlayoff.eliminated.map(mapTeams) ?? [],
    },
    nfc: {
      divisional: mapTeams(nfcStandings[0], 1) ?? [],
      wildCard: [
        [mapTeams(nfcStandings[1], 2), mapTeams(nfcWildCards[2], 7)],
        [mapTeams(nfcStandings[2], 3), mapTeams(nfcWildCards[1], 6)],
        [mapTeams(nfcStandings[3], 4), mapTeams(nfcWildCards[0], 5)],
      ],
      inHunt: nfcNonPlayoff.inTheHunt.map(mapTeams) ?? [],
      eliminated: nfcNonPlayoff.eliminated.map(mapTeams) ?? [],
    },
  } as PlayoffPictureProps;
}

function getPlayoffStatus(
  teamsNotInWildCard: AmericanFootballTeamStanding[],
  wildCardTeams: AmericanFootballTeamStanding[],
  divisionTables: AmericanFootballStanding[],
) {
  const TotalGames = 17;

  const eliminated: AmericanFootballTeamStanding[] = [];
  const inTheHunt: AmericanFootballTeamStanding[] = [];

  // Helper function to calculate win percentage
  const calculateWinPercentage = (team: AmericanFootballTeamStanding) => {
    const totalGames = team.played;
    if (totalGames === 0) return 0;
    return (team.won + team.ties * 0.5) / totalGames;
  };

  // Helper function to calculate maximum possible win percentage
  const calculateMaxWinPercentage = (team: AmericanFootballTeamStanding) => {
    const gamesRemaining = TotalGames - team.played;
    const maxWins = team.won + gamesRemaining;
    return (maxWins + team.ties * 0.5) / TotalGames;
  };

  // Helper function to calculate win percentage
  const calculateMinWinPercentage = (team: AmericanFootballTeamStanding) => {
    if (team.played === 0) return 0;
    return (team.won + team.ties * 0.5) / TotalGames;
  };

  // Find the lowest win percentage among the wild-card teams
  const minWildCardWinPct = Math.min(
    ...wildCardTeams.map(calculateWinPercentage),
  );

  // Find which division each team belongs to
  const getTeamDivision = (teamId: number): AmericanFootballStanding | null => {
    return (
      divisionTables.find((divTable) =>
        divTable.standings.some((standing) => standing.team.id === teamId),
      ) || null
    );
  };

  teamsNotInWildCard.forEach((team) => {
    const maxPossibleWinPct = calculateMaxWinPercentage(team);

    // Check 1: Can they catch the worst wild-card team?
    const canMakeWildCard = maxPossibleWinPct >= minWildCardWinPct;

    // Check 2: Can they win their division?
    let canWinDivision = false;
    const teamDivision = getTeamDivision(team.team.id);

    if (teamDivision) {
      // Find the current division leader (first team in division standings)
      const divisionLeader = teamDivision.standings[0];

      // Only check if this team is not already the division leader
      if (divisionLeader.team.id !== team.team.id) {
        const divisionLeaderCurrentWinPct =
          calculateMinWinPercentage(divisionLeader);

        // Check if team can achieve a better win percentage than current division leader by seasons end
        canWinDivision =
          TotalGames - team.played == 0
            ? maxPossibleWinPct > divisionLeaderCurrentWinPct
            : maxPossibleWinPct >= divisionLeaderCurrentWinPct;
      }
    }

    // Team is in the hunt if they can make playoffs via either

    if (canMakeWildCard || canWinDivision) {
      inTheHunt.push(team);
    } else {
      eliminated.push(team);
    }
  });

  return { eliminated, inTheHunt };
}
