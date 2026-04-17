import type {
  PlayoffPictureConfig,
  PlayoffPictureGroup,
  PlayoffPictureSection,
  PlayoffPictureStanding,
  PlayoffPictureStandingsGroup,
  PlayoffPictureStructure,
  PlayoffPictureTeam,
} from "@/types/playoff-picture";

// ── Public API ──

export function resolvePlayoffPicture(
  config: PlayoffPictureConfig | undefined,
  standingsGroups: PlayoffPictureStandingsGroup[] | undefined,
): PlayoffPictureGroup[] | undefined {
  if (!config || !standingsGroups?.length) return undefined;

  const buildStructure = STRUCTURE_MAP[config.structure];
  if (!buildStructure) return undefined;

  return buildStructure(standingsGroups, config);
}

// ── Ranking helpers (exported for reuse) ──

export function getRankingValue(
  team: PlayoffPictureStanding,
  config: PlayoffPictureConfig,
): number {
  if (config.customRankingValue) return config.customRankingValue(team);
  if (config.rankingSystem === "percentage") {
    if (team.played === 0) return 0;
    return (team.wins + team.draws * 0.5) / team.played;
  }
  return (
    team.wins * (config.pointsPerWin ?? 2) +
    team.draws * (config.pointsPerDraw ?? 1)
  );
}

export function getMaxRankingValue(
  team: PlayoffPictureStanding,
  config: PlayoffPictureConfig,
): number {
  if (config.customRankingValue) {
    const projected: PlayoffPictureStanding = {
      ...team,
      wins: team.wins + (team.totalSeasonGames - team.played),
      played: team.totalSeasonGames,
    };
    return config.customRankingValue(projected);
  }
  const remaining = team.totalSeasonGames - team.played;
  if (config.rankingSystem === "percentage") {
    return (team.wins + remaining + team.draws * 0.5) / team.totalSeasonGames;
  }
  return (
    (team.wins + remaining) * (config.pointsPerWin ?? 2) +
    team.draws * (config.pointsPerDraw ?? 1)
  );
}

// ── Internal helpers ──

function toTeam(standing: PlayoffPictureStanding): PlayoffPictureTeam {
  return {
    id: standing.team.id,
    name: standing.team.name,
    logo: standing.team.logo,
    position: standing.position,
    positionDisplay: standing.position,
  };
}

function classifyNonQualifiers(
  qualifiers: PlayoffPictureStanding[],
  rest: PlayoffPictureStanding[],
  config: PlayoffPictureConfig,
) {
  const minQualifyingValue = Math.min(
    ...qualifiers.map((t) => getRankingValue(t, config)),
  );

  const inTheHunt: PlayoffPictureStanding[] = [];
  const eliminated: PlayoffPictureStanding[] = [];

  rest.forEach((team) => {
    getMaxRankingValue(team, config) >= minQualifyingValue
      ? inTheHunt.push(team)
      : eliminated.push(team);
  });

  return { inTheHunt, eliminated };
}

// ── Structure map: layout + classification per structure ──

const STRUCTURE_MAP: Record<
  PlayoffPictureStructure,
  (
    groups: PlayoffPictureStandingsGroup[],
    config: PlayoffPictureConfig,
  ) => PlayoffPictureGroup[]
> = {
  top8: (groups, config) => {
    const standings = groups[0]?.standings ?? [];

    const qualifiers = standings.slice(0, config.qualifyingPositions);
    const rest = standings.slice(config.qualifyingPositions);
    const { inTheHunt, eliminated } = classifyNonQualifiers(
      qualifiers,
      rest,
      config,
    );

    return [
      {
        conferenceMatches: [
          {
            title: "Qualifying Finals",
            teams: [
              [toTeam(qualifiers[0]), toTeam(qualifiers[3])],
              [toTeam(qualifiers[1]), toTeam(qualifiers[2])],
            ],
          } as PlayoffPictureSection,
          {
            title: "Elimination Finals",
            teams: [
              [toTeam(qualifiers[4]), toTeam(qualifiers[7])],
              [toTeam(qualifiers[5]), toTeam(qualifiers[6])],
            ],
          } as PlayoffPictureSection,
          ...[{ title: "In the Hunt", teams: inTheHunt.map(toTeam) }],
          ...[{ title: "Eliminated", teams: eliminated.map(toTeam) }],
        ],
      },
    ];
  },
  top10: (groups, config) => {
    const standings = groups[0]?.standings ?? [];
    const qualifiers = standings.slice(0, config.qualifyingPositions);
    const rest = standings.slice(config.qualifyingPositions);
    const { inTheHunt, eliminated } = classifyNonQualifiers(
      qualifiers,
      rest,
      config,
    );

    return [
      {
        conferenceMatches: [
          {
            title: "Qualifying Finals",
            teams: [
              [toTeam(qualifiers[0]), toTeam(qualifiers[3])],
              [toTeam(qualifiers[1]), toTeam(qualifiers[2])],
            ],
          } as PlayoffPictureSection,
          {
            title: "Elimination Finals",
            teams: [
              [
                toTeam(qualifiers[4]),
                {
                  id: "LowWild",
                  name: "Low Wild Card seed",
                  positionDisplay: "LowWC",
                },
              ],
              [
                toTeam(qualifiers[5]),
                {
                  id: "HighWild",
                  name: "High Wild Card seed",
                  positionDisplay: "HighWC",
                },
              ],
            ],
          } as PlayoffPictureSection,
          {
            title: "Wild Card Finals",
            teams: [
              [toTeam(qualifiers[6]), toTeam(qualifiers[9])],
              [toTeam(qualifiers[7]), toTeam(qualifiers[8])],
            ],
          } as PlayoffPictureSection,
          ...[{ title: "In the Hunt", teams: inTheHunt.map(toTeam) }],
          ...[{ title: "Eliminated", teams: eliminated.map(toTeam) }],
        ],
      },
    ];
  },
};
