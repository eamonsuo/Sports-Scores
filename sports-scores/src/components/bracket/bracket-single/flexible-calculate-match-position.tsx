import { Match } from "../types";

interface PositionCalculationParams {
  canvasPadding: number;
  rowHeight: number;
  columnWidth: number;
  offsetX?: number;
  offsetY?: number;
}

// Memoization cache for match positions to avoid recalculating
const positionCache = new Map<string, { x: number; y: number }>();

/**
 * Clears the position calculation cache. Should be called when matches data changes.
 */
export const clearPositionCache = () => {
  positionCache.clear();
};

/**
 * Generates a cache key for a match position calculation
 */
const getCacheKey = (
  matchId: string | number,
  columnIndex: number,
  params: PositionCalculationParams,
): string => {
  return `${matchId}-${columnIndex}-${params.canvasPadding}-${params.rowHeight}-${params.columnWidth}-${params.offsetX || 0}-${params.offsetY || 0}`;
};

/**
 * Calculates the position of a match in a flexible bracket.
 * Unlike the standard algorithm which uses exponential spacing for a complete binary tree,
 * this algorithm aligns matches based on where their output goes.
 * Uses memoization to avoid redundant calculations.
 */
export const calculateFlexibleMatchPosition = (
  match: Match,
  rowIndex: number,
  columnIndex: number,
  columns: Match[][],
  allMatches: Match[],
  {
    canvasPadding,
    rowHeight,
    columnWidth,
    offsetX = 0,
    offsetY = 0,
  }: PositionCalculationParams,
) => {
  const params = { canvasPadding, rowHeight, columnWidth, offsetX, offsetY };
  const cacheKey = getCacheKey(match.id, columnIndex, params);

  // Check cache first
  const cached = positionCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const x = columnIndex * columnWidth + canvasPadding + offsetX;

  // Find the previous matches that feed into this match
  const previousMatches = allMatches.filter((m) => m.nextMatchId === match.id);

  let y: number;

  if (previousMatches.length === 0) {
    // No previous matches - this is a starting match
    // Position starting matches evenly spaced in the column
    const currentColumn = columns[columnIndex] || [];
    const startingMatchesInColumn = currentColumn.filter((m) => {
      const prevs = allMatches.filter((pm) => pm.nextMatchId === m.id);
      return prevs.length === 0;
    });

    // Find the index of this match among starting matches
    const startingIndex = startingMatchesInColumn.findIndex(
      (m) => m.id === match.id,
    );

    // Calculate even spacing for starting matches
    const spacing = rowHeight;
    const startY = canvasPadding + rowHeight * 0.3;

    // Space matches evenly from top to bottom
    y = startY + startingIndex * spacing + offsetY;
  } else if (previousMatches.length === 1) {
    // One previous match - align horizontally with it
    const prevColumnIndex = columnIndex > 0 ? columnIndex - 1 : 0;
    const prevMatch = previousMatches[0];
    const prevRowIndex =
      columns[prevColumnIndex]?.findIndex((m) => m.id === prevMatch.id) ?? 0;

    // Recursively calculate the previous match position
    const prevPos = calculateFlexibleMatchPosition(
      prevMatch,
      prevRowIndex,
      prevColumnIndex,
      columns,
      allMatches,
      { canvasPadding, rowHeight, columnWidth, offsetX, offsetY },
    );

    // Align horizontally with the single parent
    y = prevPos.y;
  } else if (previousMatches.length === 2) {
    // Two previous matches - position in the middle between them
    const prevColumnIndex = columnIndex > 0 ? columnIndex - 1 : 0;

    // Calculate positions of the previous matches
    const prevPositions = previousMatches.map((prevMatch) => {
      const prevRowIndex =
        columns[prevColumnIndex]?.findIndex((m) => m.id === prevMatch.id) ?? 0;
      // Recursively calculate the previous match position
      const prevPos = calculateFlexibleMatchPosition(
        prevMatch,
        prevRowIndex,
        prevColumnIndex,
        columns,
        allMatches,
        { canvasPadding, rowHeight, columnWidth, offsetX, offsetY },
      );
      return prevPos.y;
    });

    // Position in the middle of the two previous matches
    const avgY = (prevPositions[0] + prevPositions[1]) / 2;
    y = avgY;
  } else {
    // More than 2 previous matches (unusual) - use average position
    const prevColumnIndex = columnIndex > 0 ? columnIndex - 1 : 0;

    const prevPositions = previousMatches.map((prevMatch) => {
      const prevRowIndex =
        columns[prevColumnIndex]?.findIndex((m) => m.id === prevMatch.id) ?? 0;
      const prevPos = calculateFlexibleMatchPosition(
        prevMatch,
        prevRowIndex,
        prevColumnIndex,
        columns,
        allMatches,
        { canvasPadding, rowHeight, columnWidth, offsetX, offsetY },
      );
      return prevPos.y;
    });

    const avgY =
      prevPositions.reduce((sum, pos) => sum + pos, 0) / prevPositions.length;
    y = avgY;
  }

  // Check for overlap with sibling matches in the same column and adjust if necessary
  const currentColumn = columns[columnIndex] || [];
  const siblingMatches = currentColumn.filter((m) => m.id !== match.id);
  const minSpacing = rowHeight * 1.2; // Minimum spacing between matches

  // Calculate positions of all siblings that come before this match in the column
  for (let i = 0; i < rowIndex; i++) {
    const siblingMatch = currentColumn[i];
    if (siblingMatch && siblingMatch.id !== match.id) {
      const siblingRowIndex = i;
      const siblingPos = calculateFlexibleMatchPosition(
        siblingMatch,
        siblingRowIndex,
        columnIndex,
        columns,
        allMatches,
        { canvasPadding, rowHeight, columnWidth, offsetX, offsetY },
      );

      // If this match would overlap with the sibling, push it down
      if (Math.abs(y - siblingPos.y) < minSpacing) {
        if (rowIndex > siblingRowIndex) {
          // This match comes after the sibling, so push it down
          y = siblingPos.y + minSpacing;
        }
      }
    }
  }

  const result = { x, y };

  // Cache the result
  positionCache.set(cacheKey, result);

  return result;
};

/**
 * Calculates positions for all matches in a column based on flexible spacing
 * This ensures matches are evenly distributed when there's no next match to align to
 */
export const calculateColumnPositions = (
  column: Match[],
  columnIndex: number,
  canvasPadding: number,
  rowHeight: number,
): Map<string | number, number> => {
  const positions = new Map<string | number, number>();

  if (column.length === 0) {
    return positions;
  }

  // Calculate spacing for this column
  const spacing = rowHeight * 2;
  const startY = canvasPadding + rowHeight / 2;

  column.forEach((match, index) => {
    const y = startY + index * spacing;
    positions.set(match.id, y);
  });

  return positions;
};
