import { Match } from "../types";

// Memoization cache for previous matches lookups
const previousMatchesCache = new Map<string, Match[]>();

/**
 * Clears the previous matches cache. Should be called when matches data changes.
 */
export const clearPreviousMatchesCache = () => {
  previousMatchesCache.clear();
};

/**
 * Analyzes a bracket structure to determine metadata about rounds, starting matches, and byes
 */
export interface BracketAnalysis {
  totalRounds: number;
  matchesPerRound: Map<number, Match[]>;
  startingMatches: Set<string | number>;
  byeMatches: Set<string | number>;
  finalMatch: Match | null;
}

/**
 * Determines if a match is a starting match (no previous matches feed into it)
 */
export function isStartingMatch(match: Match, allMatches: Match[]): boolean {
  // A match is a starting match if no other match has this match as its nextMatchId
  return !allMatches.some((m) => m.nextMatchId === match.id);
}

/**
 * Determines if a match is a bye match (only has 1 participant)
 * A match with 0 participants is NOT a bye - it's an unfilled match (like a final waiting for winners)
 * A bye match has exactly 1 participant (the team advancing without playing)
 */
export function isByeMatch(match: Match): boolean {
  if (!match.participants || match.participants.length === 0) {
    return false; // Empty match is not a bye
  }

  // Check if there's only one valid participant
  const validParticipants = match.participants.filter(
    (p) => p && p.id !== null && p.id !== undefined,
  );

  // A bye match has exactly 1 valid participant
  return validParticipants.length === 1;
}

/**
 * Gets all previous matches that feed into the given match (0, 1, or 2 matches)
 * Uses memoization for better performance.
 */
export function getPreviousMatchesFlexible(
  match: Match,
  allMatches: Match[],
): Match[] {
  const cacheKey = `${match.id}-${allMatches.length}`;

  // Check cache first
  const cached = previousMatchesCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = allMatches
    .filter((m) => m.nextMatchId === match.id)
    .sort((a, b) => {
      // Sort by id to maintain consistent ordering
      const aId = typeof a.id === "string" ? parseInt(a.id, 10) : a.id;
      const bId = typeof b.id === "string" ? parseInt(b.id, 10) : b.id;
      return aId - bId;
    });

  // Cache the result
  previousMatchesCache.set(cacheKey, result);

  return result;
}

/**
 * Resolves the effective bye render mode for a match
 */
export function getEffectiveByeRenderMode(
  match: Match,
): "skip" | "show-with-indicator" {
  return match.byeRenderMode ?? "skip";
}

/**
 * Performs a comprehensive analysis of the bracket structure
 */
export function analyzeBracketStructure(matches: Match[]): BracketAnalysis {
  // Find the final match (no nextMatchId)
  const finalMatch = matches.find((match) => !match.nextMatchId) || null;

  // Identify starting matches
  const startingMatches = new Set<string | number>();
  matches.forEach((match) => {
    if (isStartingMatch(match, matches)) {
      startingMatches.add(match.id);
    }
  });

  // Identify bye matches
  const byeMatches = new Set<string | number>();
  matches.forEach((match) => {
    if (isByeMatch(match)) {
      byeMatches.add(match.id);
    }
  });

  // Build a map of round number to matches
  // We'll build this by working backwards from the final
  const matchesPerRound = new Map<number, Match[]>();

  if (finalMatch) {
    // Use BFS to assign round numbers
    const roundMap = new Map<string | number, number>();
    roundMap.set(finalMatch.id, 0);

    const queue: Match[] = [finalMatch];
    let maxRound = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentRound = roundMap.get(current.id)!;

      const previousMatches = getPreviousMatchesFlexible(current, matches);
      previousMatches.forEach((prevMatch) => {
        if (!roundMap.has(prevMatch.id)) {
          const prevRound = currentRound + 1;
          roundMap.set(prevMatch.id, prevRound);
          maxRound = Math.max(maxRound, prevRound);
          queue.push(prevMatch);
        }
      });
    }

    // Group matches by round (reversed so round 0 is first)
    roundMap.forEach((round, matchId) => {
      const reversedRound = maxRound - round;
      const match = matches.find((m) => m.id === matchId)!;

      if (!matchesPerRound.has(reversedRound)) {
        matchesPerRound.set(reversedRound, []);
      }
      matchesPerRound.get(reversedRound)!.push(match);
    });
  }

  return {
    totalRounds: matchesPerRound.size,
    matchesPerRound,
    startingMatches,
    byeMatches,
    finalMatch,
  };
}
