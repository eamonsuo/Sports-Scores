import React from "react";
import useMatchHighlightContext from "../hooks/use-match-highlight";
import { getCalculatedStyles } from "../settings";
import { Match } from "../types";
import { calculateFlexibleMatchPosition } from "./flexible-calculate-match-position";

interface FlexibleConnectorsProps {
  bracketSnippet: {
    currentMatch: Match;
    previousMatches: Match[];
  };
  rowIndex: number;
  columnIndex: number;
  style: any;
  offsetY?: number;
  columns: Match[][];
  allMatches: Match[];
}

/**
 * Flexible connector component that handles 0, 1, or 2 previous matches.
 * - 0 previous matches: No connector lines
 * - 1 previous match: Single line from center to center
 * - 2 previous matches: Dual lines (standard bracket connectors)
 */
const FlexibleConnectors: React.FC<FlexibleConnectorsProps> = ({
  bracketSnippet,
  rowIndex,
  columnIndex,
  style,
  offsetY = 0,
  columns,
  allMatches,
}) => {
  const {
    boxHeight,
    connectorColor,
    roundHeader,
    roundSeparatorWidth,
    lineInfo,
    horizontalOffset,
    connectorColorHighlight,
    width,
    columnWidth,
    rowHeight,
    canvasPadding,
  } = getCalculatedStyles(style);

  const { currentMatch, previousMatches } = bracketSnippet;

  // Calculate current match position
  const currentMatchPosition = calculateFlexibleMatchPosition(
    currentMatch,
    rowIndex,
    columnIndex,
    columns,
    allMatches,
    {
      canvasPadding,
      rowHeight,
      columnWidth,
      offsetY,
    },
  );

  const { topHighlighted, bottomHighlighted } = useMatchHighlightContext({
    bracketSnippet: {
      currentMatch,
      previousTopMatch: previousMatches[0] || null,
      previousBottomMatch: previousMatches[1] || null,
    } as any,
  });

  const middlePointOfMatchComponent = boxHeight / 2;

  // No previous matches - render nothing
  if (previousMatches.length === 0) {
    return null;
  }

  // Calculate positions for previous matches
  const previousMatchPositions = previousMatches.map((prevMatch, index) => {
    const prevColumn = columns[columnIndex - 1];
    const prevRowIndex = prevColumn.findIndex((m) => m.id === prevMatch.id);
    return calculateFlexibleMatchPosition(
      prevMatch,
      prevRowIndex,
      columnIndex - 1,
      columns,
      allMatches,
      {
        canvasPadding,
        rowHeight,
        columnWidth,
        offsetY,
      },
    );
  });

  // Single previous match - draw a single line from center to center
  if (previousMatches.length === 1) {
    const previousMatchPosition = previousMatchPositions[0];

    const startX =
      currentMatchPosition.x - horizontalOffset - (lineInfo.separation ?? 0);
    const startY =
      currentMatchPosition.y +
      middlePointOfMatchComponent +
      (roundHeader.isShown
        ? (roundHeader.height ?? 0) + (roundHeader.marginBottom ?? 0)
        : 0);

    const horizontalWidthLeft =
      currentMatchPosition.x - roundSeparatorWidth / 2 - horizontalOffset;
    const verticalHeight =
      previousMatchPosition.y +
      middlePointOfMatchComponent +
      (roundHeader.isShown
        ? (roundHeader.height ?? 0) + (roundHeader.marginBottom ?? 0)
        : 0);
    const horizontalWidthRight = previousMatchPosition.x + width;

    const isPreviousMatchOnSameYLevel =
      Math.abs(currentMatchPosition.y - previousMatchPosition.y) < 1;

    let pathData: string[];
    if (isPreviousMatchOnSameYLevel) {
      pathData = [`M${startX} ${startY}`, `H${horizontalWidthRight}`];
    } else {
      pathData = [
        `M${startX} ${startY}`,
        `H${horizontalWidthLeft}`,
        `V${verticalHeight}`,
        `H${horizontalWidthRight}`,
      ];
    }

    return (
      <path
        d={pathData.join(" ")}
        fill="transparent"
        stroke={
          topHighlighted || bottomHighlighted
            ? connectorColorHighlight
            : connectorColor
        }
      />
    );
  }

  // Two previous matches - draw dual lines (standard bracket connectors)
  const pathInfo = (multiplier: number, previousMatchPosition: any) => {
    const startPoint = `${
      currentMatchPosition.x - horizontalOffset - (lineInfo.separation ?? 0)
    } ${
      currentMatchPosition.y +
      (lineInfo.homeVisitorSpread ?? 0) * multiplier +
      middlePointOfMatchComponent +
      (roundHeader.isShown
        ? (roundHeader.height ?? 0) + (roundHeader.marginBottom ?? 0)
        : 0)
    }`;

    const horizontalWidthLeft =
      currentMatchPosition.x - roundSeparatorWidth / 2 - horizontalOffset;

    const isPreviousMatchOnSameYLevel =
      Math.abs(currentMatchPosition.y - previousMatchPosition.y) < 1;

    const verticalHeight =
      previousMatchPosition.y +
      middlePointOfMatchComponent +
      (roundHeader.isShown
        ? (roundHeader.height ?? 0) + (roundHeader.marginBottom ?? 0)
        : 0);
    const horizontalWidthRight = previousMatchPosition.x + width;

    if (isPreviousMatchOnSameYLevel) {
      return [`M${startPoint}`, `H${horizontalWidthRight}`];
    }

    return [
      `M${startPoint}`,
      `H${horizontalWidthLeft}`,
      `V${verticalHeight}`,
      `H${horizontalWidthRight}`,
    ];
  };

  const { x, y } = currentMatchPosition;

  return (
    <>
      <path
        d={pathInfo(-1, previousMatchPositions[0]).join(" ")}
        id={`connector-${x}-${y}-${-1}`}
        fill="transparent"
        stroke={topHighlighted ? connectorColorHighlight : connectorColor}
      />
      <path
        d={pathInfo(1, previousMatchPositions[1]).join(" ")}
        id={`connector-${x}-${y}-${1}`}
        fill="transparent"
        stroke={bottomHighlighted ? connectorColorHighlight : connectorColor}
      />
      {topHighlighted && <use href={`#connector-${x}-${y}-${-1}`} />}
      {bottomHighlighted && <use href={`#connector-${x}-${y}-${1}`} />}
    </>
  );
};

export default React.memo(FlexibleConnectors);
