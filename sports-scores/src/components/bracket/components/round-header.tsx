import React from "react";
import styled from "styled-components";
import { Options, Theme } from "../types";

export interface RoundHeaderProps {
  x: number;
  y?: number;
  width: number;
  roundHeader: Required<NonNullable<Options["roundHeader"]>>;
  canvasPadding: number;
  numOfRounds: number;
  tournamentRoundText?: string;
  customRoundTitle?: string;
  columnIndex: number;
}

const Text = styled.text<{ theme: Theme }>`
  font-family: ${({ theme }) => theme.fontFamily};
  color: ${({ theme }) => theme.textColor.highlighted};
`;
const Rect = styled.rect.attrs<{ theme: Theme }>(({ theme }) => ({
  fill: theme.roundHeaders.background,
}))``;

function RoundHeader({
  x,
  y = 0,
  width,
  roundHeader,
  canvasPadding,
  numOfRounds,
  tournamentRoundText,
  customRoundTitle,
  columnIndex,
}: RoundHeaderProps) {
  return (
    <g>
      <Rect
        x={x}
        y={y + canvasPadding}
        width={width}
        height={roundHeader.height}
        fill={roundHeader.backgroundColor}
        rx="3"
        ry="3"
      />
      <Text
        x={x + width / 2}
        y={y + canvasPadding + roundHeader.height / 2}
        style={{
          fontFamily: roundHeader.fontFamily,
          fontSize: `${roundHeader.fontSize}px`,
          color: roundHeader.fontColor,
        }}
        fill="currentColor"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {customRoundTitle ||
          (roundHeader.roundTextGenerator &&
            roundHeader.roundTextGenerator(columnIndex + 1, numOfRounds)) ||
          (columnIndex + 1 === numOfRounds && "Final") ||
          (columnIndex + 1 === numOfRounds - 1 && "Semi-final") ||
          (columnIndex + 1 < numOfRounds - 1 && `Round ${tournamentRoundText}`)}
      </Text>
    </g>
  );
}

export default React.memo(RoundHeader);
