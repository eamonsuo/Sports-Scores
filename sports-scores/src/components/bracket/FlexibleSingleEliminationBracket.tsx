"use client";
import React, { useEffect, useMemo } from "react";
import { ThemeProvider } from "styled-components";
import {
  calculateFlexibleMatchPosition,
  clearPositionCache,
} from "./bracket-single/flexible-calculate-match-position";
import FlexibleConnectors from "./bracket-single/flexible-connectors";
import RoundHeader from "./components/round-header";
import { calculateSVGDimensions } from "./core/calculate-svg-dimensions";
import { MatchContextProvider } from "./core/match-context";
import MatchWrapper from "./core/match-wrapper";
import { defaultStyle, getCalculatedStyles } from "./settings";
import defaultTheme from "./themes/themes";
import { FlexibleSingleElimLeaderboardProps } from "./types";
import {
  clearPreviousMatchesCache,
  getEffectiveByeRenderMode,
  getPreviousMatchesFlexible,
  isByeMatch,
} from "./utils/bracket-analysis";
import { buildFlexibleColumnStructureMultiFinal } from "./utils/flexible-bracket-helpers";

/**
 * FlexibleSingleEliminationBracket - A bracket component that supports dynamic match counts per round.
 * Unlike the standard SingleEliminationBracket which requires a complete binary tree structure,
 * this component allows teams to start in any round, eliminating the need for excessive byes.
 *
 * @component
 * @example
 * ```tsx
 * <FlexibleSingleEliminationBracket
 *   matches={matchesData}
 *   matchComponent={CustomMatchComponent}
 *   onMatchClick={handleMatchClick}
 *   onPartyClick={handlePartyClick}
 * />
 * ```
 *
 * Features:
 * - Supports multiple final matches (no nextMatchId)
 * - Custom round titles via match.roundTitle property
 * - Optimized with memoization for large brackets
 * - Automatic cache management
 */
const FlexibleSingleEliminationBracket = ({
  matches,
  matchComponent,
  currentRound,
  onMatchClick,
  onPartyClick,
  svgWrapper: SvgWrapper = ({ children }) => <div>{children}</div>,
  theme = defaultTheme,
  options: { style: inputStyle } = {
    style: defaultStyle,
  },
}: FlexibleSingleElimLeaderboardProps) => {
  // Memoize style object to prevent unnecessary recalculations
  const style = useMemo(
    () => ({
      ...defaultStyle,
      ...inputStyle,
      roundHeader: {
        ...defaultStyle.roundHeader,
        ...(inputStyle?.roundHeader ?? {}),
      },
      lineInfo: {
        ...defaultStyle.lineInfo,
        ...(inputStyle?.lineInfo ?? {}),
      },
    }),
    [inputStyle],
  );

  const { roundHeader, columnWidth, canvasPadding, rowHeight, width } =
    getCalculatedStyles(style);

  // Clear position cache when matches change
  useEffect(() => {
    clearPositionCache();
    clearPreviousMatchesCache();
  }, [matches]);

  // Memoize expensive column structure calculation
  const columns = useMemo(
    () => buildFlexibleColumnStructureMultiFinal(matches),
    [matches],
  );

  // Memoize first round participant IDs calculation
  const firstRoundParticipantIds = useMemo(() => {
    const roundNumbers = matches
      .map((m) => parseInt(m.tournamentRoundText || "0", 10))
      .filter((n) => !isNaN(n) && n > 0);
    const firstRoundNumber =
      roundNumbers.length > 0 ? Math.min(...roundNumbers) : 1;

    const participantIds = new Set<string | number>();
    matches.forEach((match) => {
      const roundNum = parseInt(match.tournamentRoundText || "0", 10);
      if (roundNum === firstRoundNumber) {
        match.participants.forEach((participant) => {
          if (participant?.id) {
            participantIds.add(participant.id);
          }
        });
      }
    });
    return participantIds;
  }, [matches]);

  // Early return with proper error handling
  if (!matches || matches.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[FlexibleSingleEliminationBracket] No matches provided");
    }
    return null;
  }

  if (columns.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[FlexibleSingleEliminationBracket] No columns generated for bracket",
      );
    }
    return null;
  }

  // Build a filtered version of columns for rendering and positioning
  // Show ALL matches, including those with no participants
  // This allows empty matches to render like the final match does
  const visibleColumns = columns.map((column) => column);

  // Calculate SVG dimensions based on the maximum number of visible matches
  // Account for spacing between matches (spacing = rowHeight * 2.5)
  const maxVisibleMatchesInColumn = Math.max(
    ...visibleColumns.map((col) => col.length),
  );

  const { gameWidth, gameHeight, startPosition } = calculateSVGDimensions(
    maxVisibleMatchesInColumn,
    visibleColumns.length,
    rowHeight,
    columnWidth,
    canvasPadding,
    roundHeader,
    currentRound,
  );

  return (
    <ThemeProvider theme={theme}>
      <SvgWrapper
        bracketWidth={gameWidth}
        bracketHeight={gameHeight}
        startAt={startPosition}
      >
        <svg
          height={gameHeight}
          width={gameWidth}
          viewBox={`0 0 ${gameWidth} ${gameHeight}`}
        >
          <MatchContextProvider>
            <g>
              {/* Render round headers once per column at the top */}
              {roundHeader.isShown &&
                visibleColumns.map((matchesColumn, columnIndex) => {
                  const firstMatchInColumn = matchesColumn[0];
                  if (!firstMatchInColumn) return null;

                  const x = canvasPadding + columnIndex * columnWidth;

                  return (
                    <RoundHeader
                      key={`header-${columnIndex}`}
                      x={x}
                      y={0}
                      roundHeader={
                        roundHeader as Required<NonNullable<typeof roundHeader>>
                      }
                      canvasPadding={canvasPadding}
                      width={width}
                      numOfRounds={visibleColumns.length}
                      tournamentRoundText={
                        firstMatchInColumn.tournamentRoundText ?? ""
                      }
                      customRoundTitle={firstMatchInColumn.roundTitle}
                      columnIndex={columnIndex}
                    />
                  );
                })}

              {/* Render matches */}
              {visibleColumns.map((matchesColumn, columnIndex) =>
                matchesColumn.map((match, rowIndex) => {
                  const { x, y } = calculateFlexibleMatchPosition(
                    match,
                    rowIndex,
                    columnIndex,
                    visibleColumns,
                    matches,
                    {
                      canvasPadding,
                      columnWidth,
                      rowHeight,
                    },
                  );

                  const previousMatches = getPreviousMatchesFlexible(
                    match,
                    matches,
                  );

                  // Include ALL previous matches for connector drawing
                  const visiblePreviousMatches = previousMatches;

                  // Determine if this is a bye match and how to render it
                  const isBye = isByeMatch(match);
                  const byeMode = getEffectiveByeRenderMode(match);

                  // Determine which participants are late entries
                  // A participant is a late entry if they're NOT in the first round
                  const lateEntryParticipantIds = new Set<string | number>();
                  match.participants.forEach((participant) => {
                    if (
                      participant?.id &&
                      !firstRoundParticipantIds.has(participant.id)
                    ) {
                      lateEntryParticipantIds.add(participant.id);
                    }
                  });

                  // Get match name - add bye indicator if needed
                  let displayName = match.name;
                  if (isBye && byeMode === "show-with-indicator") {
                    const nextRound = match.tournamentRoundText
                      ? parseInt(match.tournamentRoundText, 10) + 1
                      : columnIndex + 2;
                    displayName = `Bye to Round ${nextRound}`;
                  }

                  return (
                    <g key={`${match.id}-${columnIndex}-${rowIndex}`}>
                      {columnIndex !== 0 &&
                        visiblePreviousMatches.length > 0 && (
                          <FlexibleConnectors
                            bracketSnippet={{
                              currentMatch: match,
                              previousMatches: visiblePreviousMatches,
                            }}
                            rowIndex={rowIndex}
                            columnIndex={columnIndex}
                            style={style}
                            columns={visibleColumns}
                            allMatches={matches}
                          />
                        )}
                      <g>
                        <MatchWrapper
                          x={x}
                          y={
                            y +
                            (roundHeader.isShown
                              ? (roundHeader.height ?? 0) +
                                (roundHeader.marginBottom ?? 0)
                              : 0)
                          }
                          rowIndex={rowIndex}
                          columnIndex={columnIndex}
                          match={match}
                          previousBottomMatch={
                            (visiblePreviousMatches[1] as any) ?? undefined
                          }
                          topText={match.startTime ?? ""}
                          bottomText={displayName ?? ""}
                          teams={match.participants}
                          onMatchClick={onMatchClick}
                          onPartyClick={onPartyClick}
                          style={style}
                          matchComponent={matchComponent}
                          lateEntryParticipantIds={lateEntryParticipantIds}
                        />
                      </g>
                    </g>
                  );
                }),
              )}
            </g>
          </MatchContextProvider>
        </svg>
      </SvgWrapper>
    </ThemeProvider>
  );
};

// Add display name for better debugging in Next.js dev tools
FlexibleSingleEliminationBracket.displayName =
  "FlexibleSingleEliminationBracket";

export default React.memo(FlexibleSingleEliminationBracket);
