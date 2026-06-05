import type {
  PlayoffPictureConfig,
  PlayoffPictureGroup,
  PlayoffPictureSection,
  PlayoffPictureStanding,
  PlayoffPictureStandingTables,
  PlayoffPictureStructure,
  PlayoffPictureTeam,
} from "@/types/playoff-picture"

// ── Public API ──

export function resolvePlayoffPicture(
  config: PlayoffPictureConfig | undefined,
  standingsGroups: PlayoffPictureStandingTables[] | undefined,
): PlayoffPictureGroup[] | undefined {
  if (!config || !standingsGroups?.length) return undefined

  const buildStructure = STRUCTURE_MAP[config.structure]
  if (!buildStructure) return undefined

  return buildStructure(standingsGroups, config)
}

// ── Ranking helpers (exported for reuse) ──

export function getRankingValue(
  team: PlayoffPictureStanding,
  config: PlayoffPictureConfig,
): number {
  if (config.customRankingValue) return config.customRankingValue(team)
  if (config.rankingSystem === "percentage") {
    if (team.played === 0) return 0
    return (team.wins + team.draws * 0.5) / team.played
  }
  return (
    team.wins * (config.pointsPerWin ?? 2) +
    team.draws * (config.pointsPerDraw ?? 1)
  )
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
    }
    return config.customRankingValue(projected)
  }
  const remaining = team.totalSeasonGames - team.played
  if (config.rankingSystem === "percentage") {
    return (team.wins + remaining + team.draws * 0.5) / team.totalSeasonGames
  }
  return (
    (team.wins + remaining) * (config.pointsPerWin ?? 2) +
    team.draws * (config.pointsPerDraw ?? 1)
  )
}

// ── Internal helpers ──

function toTeam(
  standing: PlayoffPictureStanding,
  positionDisplay?: string | null,
): PlayoffPictureTeam {
  return {
    id: standing.team.id,
    name: standing.team.name,
    logo: standing.team.logo,
    position: standing.position,
    positionDisplay: positionDisplay ?? standing.position,
  }
}

function classifyNonQualifiers(
  qualifiers: PlayoffPictureStanding[],
  rest: PlayoffPictureStanding[],
  config: PlayoffPictureConfig,
  divisionTables?: PlayoffPictureStandingTables[],
) {
  const minQualifyingValue = Math.min(
    ...qualifiers.map((t) => getRankingValue(t, config)),
  )

  const inTheHunt: PlayoffPictureStanding[] = []
  const eliminated: PlayoffPictureStanding[] = []

  rest.forEach((team) => {
    const remainingMatches = team.totalSeasonGames - team.played

    const canCatchQualifier =
      remainingMatches === 0
        ? getMaxRankingValue(team, config) > minQualifyingValue
        : getMaxRankingValue(team, config) >= minQualifyingValue

    let canWinDivision = false
    if (divisionTables) {
      const division = divisionTables.find((div) =>
        div.standings.some((s) => s.team.id === team.team.id),
      )

      if (division) {
        const leader = division.standings[0]
        if (leader.team.id !== team.team.id) {
          const leaderMinValue = getRankingValue(leader, config)
          canWinDivision =
            remainingMatches === 0
              ? getMaxRankingValue(team, config) > leaderMinValue
              : getMaxRankingValue(team, config) >= leaderMinValue
        }
      }
    }

    canCatchQualifier || canWinDivision
      ? inTheHunt.push(team)
      : eliminated.push(team)
  })

  return { inTheHunt, eliminated }
}

// ── Shared structure helpers ──

type NonQualifiers = ReturnType<typeof classifyNonQualifiers>

function findStandings(
  tables: PlayoffPictureStandingTables[],
  name: string,
): PlayoffPictureStanding[] {
  return tables.find((t) => t.name === name)?.standings ?? []
}

function filterDivisionTables(
  tables: PlayoffPictureStandingTables[],
  includes: string,
  excludeName: string,
): PlayoffPictureStandingTables[] {
  return tables.filter(
    (t) => t.name?.includes(includes) && t.name !== excludeName,
  )
}

function getWildCards(
  conferenceStandings: PlayoffPictureStanding[],
  qualifiedIds: Set<string | number>,
): PlayoffPictureStanding[] {
  return conferenceStandings.filter((t) => !qualifiedIds.has(t.team.id))
}

function huntAndEliminatedSections(
  nonQualifiers: NonQualifiers,
): PlayoffPictureSection[] {
  return [
    {
      title: "In the Hunt",
      teams: nonQualifiers.inTheHunt.map((team) => toTeam(team)),
    },
    {
      title: "Eliminated",
      teams: nonQualifiers.eliminated.map((team) => toTeam(team)),
    },
  ]
}

function sliceAndClassify(
  standings: PlayoffPictureStanding[],
  config: PlayoffPictureConfig,
) {
  const qualifiers = standings.slice(0, config.qualifyingPositions)
  const rest = standings.slice(config.qualifyingPositions)
  const nonQualifiers = classifyNonQualifiers(qualifiers, rest, config)
  return { qualifiers, nonQualifiers }
}

// ── Per-structure builders ──

function buildTop8(
  tables: PlayoffPictureStandingTables[],
  config: PlayoffPictureConfig,
): PlayoffPictureGroup[] {
  const standings = tables[0]?.standings ?? []
  const { qualifiers, nonQualifiers } = sliceAndClassify(standings, config)

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
        ...huntAndEliminatedSections(nonQualifiers),
      ],
    },
  ]
}

function buildTop10(
  tables: PlayoffPictureStandingTables[],
  config: PlayoffPictureConfig,
): PlayoffPictureGroup[] {
  const standings = tables[0]?.standings ?? []
  const { qualifiers, nonQualifiers } = sliceAndClassify(standings, config)

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
                positionDisplay: "8/9/10",
              },
            ],
            [
              toTeam(qualifiers[5]),
              {
                id: "HighWild",
                name: "High Wild Card seed",
                positionDisplay: "7/8/9",
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
        ...huntAndEliminatedSections(nonQualifiers),
      ],
    },
  ]
}

function buildNflConference(
  tables: PlayoffPictureStandingTables[],
  config: PlayoffPictureConfig,
  fullTableName: string,
  shortName: string,
  displayName: string,
  colour: string,
): PlayoffPictureGroup {
  const standings = findStandings(tables, fullTableName)
  const wildCard = standings.slice(4, 7)
  const inHunt = standings.slice(7)
  const divisionTables = filterDivisionTables(tables, shortName, fullTableName)
  const nonQualifiers = classifyNonQualifiers(
    wildCard,
    inHunt,
    config,
    divisionTables,
  )

  return {
    name: displayName,
    colour,
    conferenceMatches: [
      { title: "Divisional Round", teams: [toTeam(standings[0])] },
      {
        title: "Wild Card Round",
        teams: [
          [toTeam(standings[1]), toTeam(standings[6])],
          [toTeam(standings[2]), toTeam(standings[5])],
          [toTeam(standings[3]), toTeam(standings[4])],
        ],
      },
      ...huntAndEliminatedSections(nonQualifiers),
    ],
  }
}

function buildNfl(
  tables: PlayoffPictureStandingTables[],
  config: PlayoffPictureConfig,
): PlayoffPictureGroup[] {
  return [
    buildNflConference(
      tables,
      config,
      "NFL 25/26, AFC",
      "AFC",
      "AFC",
      "text-red-700 dark:text-red-400",
    ),
    buildNflConference(
      tables,
      config,
      "NFL 25/26, NFC",
      "NFC",
      "NFC",
      "text-blue-700 dark:text-blue-400",
    ),
  ]
}

function buildNbaConference(
  tables: PlayoffPictureStandingTables[],
  config: PlayoffPictureConfig,
  tableName: string,
  displayName: string,
  colour: string,
  tag: string,
): PlayoffPictureGroup {
  const standings = findStandings(tables, tableName)
  const { nonQualifiers } = sliceAndClassify(standings, config)

  if (standings.length === 0) {
    return {
      name: displayName,
      colour,
      conferenceMatches: [],
    }
  }

  return {
    name: displayName,
    colour,
    conferenceMatches: [
      {
        title: "First Round",
        teams: [
          [
            toTeam(standings[0]),
            {
              id: `8Seed${tag}`,
              name: "8 Seed",
              positionDisplay: "PIW",
            },
          ],
          [
            toTeam(standings[1]),
            { id: `7Seed${tag}`, name: "7 Seed", positionDisplay: "7/8W" },
          ],
          [toTeam(standings[2]), toTeam(standings[5])],
          [toTeam(standings[3]), toTeam(standings[4])],
        ],
      },
      {
        title: "Play-In Tournament",
        teams: [
          [toTeam(standings[6]), toTeam(standings[7])],
          [toTeam(standings[8]), toTeam(standings[9])],
          [
            {
              id: `${tag}Loser`,
              name: "7/8 Loser",
              positionDisplay: "7/8L",
            },
            {
              id: `${tag}Winner`,
              name: "9/10 Winner",
              positionDisplay: "9/10W",
            },
          ],
        ],
      },
      ...huntAndEliminatedSections(nonQualifiers),
    ],
  }
}

function buildNba(
  tables: PlayoffPictureStandingTables[],
  config: PlayoffPictureConfig,
): PlayoffPictureGroup[] {
  return [
    buildNbaConference(
      tables,
      config,
      "Western Conference",
      "Western Conference",
      "text-red-700 dark:text-red-400",
      "West",
    ),
    buildNbaConference(
      tables,
      config,
      "Eastern Conference",
      "Eastern Conference",
      "text-blue-700 dark:text-blue-400",
      "East",
    ),
  ]
}

function buildNhlConference(
  tables: PlayoffPictureStandingTables[],
  config: PlayoffPictureConfig,
  conferenceName: string,
  div1Name: string,
  div2Name: string,
  displayName: string,
  colour: string,
): PlayoffPictureGroup {
  const confStandings = findStandings(tables, conferenceName)
  const div1Standings = findStandings(tables, div1Name)
  const div2Standings = findStandings(tables, div2Name)

  // Conference leader + the other division's leader
  const otherDivLeader =
    confStandings[0]?.team.id === div1Standings[0]?.team.id
      ? div2Standings[0]
      : div1Standings[0]

  const qualified = [
    confStandings[0],
    otherDivLeader,
    div1Standings[1],
    div2Standings[1],
    div1Standings[2],
    div2Standings[2],
  ]

  // Wild cards: top 2 conference teams not already qualified
  const qualifiedIds = new Set(qualified.map((t) => t.team.id))
  const wildCards = getWildCards(confStandings, qualifiedIds)

  qualified.push(wildCards[0], wildCards[1])
  qualifiedIds.add(wildCards[0].team.id)
  qualifiedIds.add(wildCards[1].team.id)

  const inTheHunt = confStandings.filter((t) => !qualifiedIds.has(t.team.id))
  const nonQualifiers = classifyNonQualifiers(qualified, inTheHunt, config, [
    { standings: div1Standings.slice(2) },
    { standings: div2Standings.slice(2) },
  ])

  return {
    name: displayName,
    colour,
    conferenceMatches: [
      {
        title: "First Round",
        teams: [
          [toTeam(qualified[0]), toTeam(qualified[7], "WC2")],
          [toTeam(qualified[1]), toTeam(qualified[6], "WC1")],
          [toTeam(qualified[2]), toTeam(qualified[4])],
          [toTeam(qualified[3]), toTeam(qualified[5])],
        ],
      },
      ...huntAndEliminatedSections(nonQualifiers),
    ],
  }
}

function buildNhl(
  tables: PlayoffPictureStandingTables[],
  config: PlayoffPictureConfig,
): PlayoffPictureGroup[] {
  return [
    buildNhlConference(
      tables,
      config,
      "Eastern Conference",
      "Atlantic Division",
      "Metropolitan Division",
      "Eastern Conf.",
      "text-red-700 dark:text-red-400",
    ),
    buildNhlConference(
      tables,
      config,
      "Western Conference",
      "Pacific Division",
      "Central Division",
      "Western Conf.",
      "text-blue-700 dark:text-blue-400",
    ),
  ]
}

function buildMlbLeague(
  tables: PlayoffPictureStandingTables[],
  config: PlayoffPictureConfig,
  leagueName: string,
  displayName: string,
  colour: string,
  firstRoundTitle: string,
): PlayoffPictureGroup {
  const standings = findStandings(tables, leagueName)
  const divisionTables = filterDivisionTables(tables, leagueName, leagueName)

  const qualified = divisionTables
    .map((table) => table.standings[0])
    .sort((a, b) => getRankingValue(b, config) - getRankingValue(a, config))

  // Wild cards: top 3 league teams not already qualified
  const qualifiedIds = new Set(qualified.map((t) => t.team.id))
  const wildCards = getWildCards(standings, qualifiedIds)

  qualified.push(wildCards[0], wildCards[1], wildCards[2])
  qualifiedIds.add(wildCards[0].team.id)
  qualifiedIds.add(wildCards[1].team.id)
  qualifiedIds.add(wildCards[2].team.id)

  const inTheHunt = standings.filter((t) => !qualifiedIds.has(t.team.id))
  const nonQualifiers = classifyNonQualifiers(
    qualified,
    inTheHunt,
    config,
    divisionTables,
  )

  return {
    name: displayName,
    colour,
    conferenceMatches: [
      {
        title: firstRoundTitle,
        teams: [toTeam(qualified[0]), toTeam(qualified[1])],
      },
      {
        title: "Wild Card Round",
        teams: [
          [toTeam(qualified[2], "3"), toTeam(qualified[5], "6")],
          [toTeam(qualified[3], "4"), toTeam(qualified[4], "5")],
        ],
      },
      ...huntAndEliminatedSections(nonQualifiers),
    ],
  }
}

function buildMlb(
  tables: PlayoffPictureStandingTables[],
  config: PlayoffPictureConfig,
): PlayoffPictureGroup[] {
  return [
    buildMlbLeague(
      tables,
      config,
      "American League",
      "American League",
      "text-red-700 dark:text-red-400",
      "Divisional Series",
    ),
    buildMlbLeague(
      tables,
      config,
      "National League",
      "National League",
      "text-blue-700 dark:text-blue-400",
      "Divisional Round",
    ),
  ]
}

// ── Structure map: layout + classification per structure ──

const STRUCTURE_MAP: Record<
  PlayoffPictureStructure,
  (
    tables: PlayoffPictureStandingTables[],
    config: PlayoffPictureConfig,
  ) => PlayoffPictureGroup[]
> = {
  top8: buildTop8,
  top10: buildTop10,
  nfl: buildNfl,
  nba: buildNba,
  nhl: buildNhl,
  mlb: buildMlb,
}
