import { Match } from "../types";
import { getPreviousMatchesFlexible } from "./bracket-analysis";
import { sortAlphanumerically } from "./string";

/**
 * Builds a flexible column structure where each round can have a variable number of matches.
 * Works backwards from the final match, collecting all previous matches for each round.
 * NOTE: This builds the COMPLETE structure including all matches (even byes).
 * Filtering for rendering happens in the component.
 */
export function buildFlexibleColumnStructure(
  finalMatch: Match,
  allMatches: Match[],
): Match[][] {
  if (!finalMatch) {
    return [];
  }

  const columns: Match[][] = [];
  let currentColumn: Match[] = [finalMatch];

  // Build columns by working backwards from the final
  while (currentColumn.length > 0) {
    columns.unshift(currentColumn);

    const nextColumn: Match[] = [];
    currentColumn.forEach((match) => {
      const previousMatches = getPreviousMatchesFlexible(match, allMatches);
      // Include ALL previous matches to maintain the complete bracket structure
      nextColumn.push(
        ...previousMatches.sort((a, b) => sortAlphanumerically(a.name, b.name)),
      );
    });

    currentColumn = nextColumn;
  }

  return columns.filter((col) => col.length > 0);
}

/**
 * Builds a flexible column structure that supports multiple final matches.
 * Works backwards from all matches with no nextMatchId, collecting all previous matches.
 * This allows brackets to end with multiple matches in the final round.
 */
export function buildFlexibleColumnStructureMultiFinal(
  allMatches: Match[],
): Match[][] {
  // Find all final matches (matches with no nextMatchId)
  const finalMatches = allMatches.filter((match) => !match.nextMatchId);

  if (finalMatches.length === 0) {
    return [];
  }

  // If there's only one final match, use the existing logic
  if (finalMatches.length === 1) {
    return buildFlexibleColumnStructure(finalMatches[0], allMatches);
  }

  // Multiple final matches - build columns backwards from all finals
  const columns: Match[][] = [];
  let currentColumn: Match[] = finalMatches.sort((a, b) =>
    sortAlphanumerically(a.name, b.name),
  );

  // Build columns by working backwards from the finals
  while (currentColumn.length > 0) {
    columns.unshift(currentColumn);

    const nextColumn: Match[] = [];
    const addedMatchIds = new Set<string | number>();

    currentColumn.forEach((match) => {
      const previousMatches = getPreviousMatchesFlexible(match, allMatches);
      // Include ALL previous matches to maintain the complete bracket structure
      previousMatches.forEach((prevMatch) => {
        if (!addedMatchIds.has(prevMatch.id)) {
          nextColumn.push(prevMatch);
          addedMatchIds.add(prevMatch.id);
        }
      });
    });

    // Sort the next column for consistent ordering
    nextColumn.sort((a, b) => sortAlphanumerically(a.name, b.name));
    currentColumn = nextColumn;
  }

  return columns.filter((col) => col.length > 0);
}

/**
 * Information about how a match should be aligned vertically
 */
export interface MatchAlignment {
  /** The match this match feeds into */
  nextMatch: Match | null;
  /** Other matches at the same level that also feed into the same next match */
  siblingMatches: Match[];
  /** Whether this is the top or bottom sibling (when there are 2) */
  isTopSibling: boolean;
  /** The index of this match among its siblings */
  siblingIndex: number;
}

/**
 * Calculates alignment information for a match based on its relationship to the next round
 */
export function calculateMatchAlignment(
  match: Match,
  allMatches: Match[],
  columnIndex: number,
  columns: Match[][],
): MatchAlignment {
  // Find the next match
  const nextMatch = match.nextMatchId
    ? allMatches.find((m) => m.id === match.nextMatchId) || null
    : null;

  // Find sibling matches (other matches that feed into the same next match)
  const siblingMatches = nextMatch
    ? getPreviousMatchesFlexible(nextMatch, allMatches)
    : [match];

  // Determine if this is the top or bottom sibling
  const siblingIndex = siblingMatches.findIndex((m) => m.id === match.id);
  const isTopSibling = siblingIndex === 0;

  return {
    nextMatch,
    siblingMatches,
    isTopSibling,
    siblingIndex,
  };
}

/**
 * Gets the row index of a match within its column
 */
export function getMatchRowIndex(match: Match, column: Match[]): number {
  return column.findIndex((m) => m.id === match.id);
}

/**
 * Calculates the vertical center position of a match in the next round
 * This is used as an anchor point for positioning matches in the current round
 */
export function calculateNextMatchCenter(
  nextMatch: Match | null,
  columns: Match[][],
  columnIndex: number,
  rowHeight: number,
  canvasPadding: number,
): number {
  if (!nextMatch || columnIndex >= columns.length - 1) {
    // Default to center of canvas for final match
    return canvasPadding + rowHeight;
  }

  const nextColumn = columns[columnIndex + 1];
  const nextRowIndex = getMatchRowIndex(nextMatch, nextColumn);

  if (nextRowIndex === -1) {
    // If next match not found in visible columns, calculate a sensible default
    // This can happen when the next match is filtered out as a bye
    return canvasPadding + rowHeight;
  }

  // Calculate base position for the next match
  // In a flexible bracket, matches are evenly spaced within their column
  const nextColumnHeight = nextColumn.length;
  const spacing = rowHeight * 2; // Space between matches
  const startY = canvasPadding + rowHeight;

  return startY + nextRowIndex * spacing;
}
