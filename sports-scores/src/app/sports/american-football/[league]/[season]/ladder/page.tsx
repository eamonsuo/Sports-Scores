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

  const afcNonPlayoff = getPlayoffStatus(afcInHunt, afcWildCards);

  // --------- NFC ------------
  const nfcStandings =
    NFLTables.find((t) => t.tableName === "NFL 25/26, NFC")?.standings ?? []; //Get the conference standings

  const nfcWildCards = nfcStandings.slice(4, 7) ?? []; // Get wild card teams (pos 5-7)

  const nfcInHunt = nfcStandings.slice(7) ?? [];

  const nfcNonPlayoff = getPlayoffStatus(nfcInHunt, nfcWildCards);

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
) {
  const TotalGames = 17;

  const eliminated: AmericanFootballTeamStanding[] = [];
  const inTheHunt: AmericanFootballTeamStanding[] = [];

  // Find the lowest win total among the wild-card teams
  const minWildCardWins = Math.min(...wildCardTeams.map((t) => t.won));

  teamsNotInWildCard.forEach((team) => {
    const gamesRemaining = TotalGames - team.played;
    const maxPossibleWins = team.won + gamesRemaining;

    // Check for elimination based on max possible wins vs. lowest wild-card wins
    if (maxPossibleWins < minWildCardWins) {
      eliminated.push(team);
    } else {
      inTheHunt.push(team);
    }
  });

  return { eliminated, inTheHunt };
}
