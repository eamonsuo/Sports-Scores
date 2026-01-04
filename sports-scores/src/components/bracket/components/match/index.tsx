"use client";
import React from "react";
import { MatchComponentProps } from "../../types";
import {
  Anchor,
  BottomText,
  Line,
  Score,
  Side,
  StyledMatch,
  Team,
  TopText,
  Wrapper,
} from "./styles";

const LateEntryArrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    style={{
      transform: "rotate(90deg)",
      marginRight: "4px",
      marginTop: "-1px",
      verticalAlign: "middle",
      display: "inline-block",
      border: "none",
      outline: "none",
      boxShadow: "none",
    }}
  >
    <path
      fill="#22c55e"
      fillRule="evenodd"
      d="M11 19h2V7.823l3.24 3.24 1.414-1.414-4.238-4.239-1.413-1.413-1.415 1.415-4.242 4.242 1.413 1.413L11 7.826z"
      clipRule="evenodd"
      style={{
        border: "none",
        outline: "none",
      }}
    />
  </svg>
);

function Match({
  bottomHovered,
  bottomParty,
  bottomText,
  bottomWon,
  match,
  onMatchClick,
  onMouseEnter,
  onMouseLeave,
  onPartyClick,
  topHovered,
  topParty,
  topText,
  topWon,
  isTopPartyLateEntry = false,
  isBottomPartyLateEntry = false,
}: MatchComponentProps & {
  isTopPartyLateEntry?: boolean;
  isBottomPartyLateEntry?: boolean;
}) {
  return (
    <Wrapper>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <TopText>{topText}</TopText>
        {(match.href || typeof onMatchClick === "function") && (
          <Anchor
            href={match.href}
            onClick={(event) =>
              onMatchClick?.({ match, topWon, bottomWon, event })
            }
          >
            <TopText>Match Details</TopText>
          </Anchor>
        )}
      </div>
      <StyledMatch>
        <Side
          onMouseEnter={() => onMouseEnter(topParty.id)}
          onMouseLeave={onMouseLeave}
          $won={topWon}
          $hovered={topHovered}
          onClick={() => onPartyClick?.(topParty, topWon)}
        >
          <Team>
            {isTopPartyLateEntry && topParty?.id && <LateEntryArrow />}
            {topParty?.name}
          </Team>
          <Score $won={topWon}>{topParty?.resultText}</Score>
        </Side>
        <Line $highlighted={topHovered || bottomHovered} />
        <Side
          onMouseEnter={() => onMouseEnter(bottomParty.id)}
          onMouseLeave={onMouseLeave}
          $won={bottomWon}
          $hovered={bottomHovered}
          onClick={() => onPartyClick?.(bottomParty, bottomWon)}
        >
          <Team>
            {isBottomPartyLateEntry && bottomParty?.id && <LateEntryArrow />}
            {bottomParty?.name}
          </Team>
          <Score $won={bottomWon}>{bottomParty?.resultText}</Score>
        </Side>
      </StyledMatch>
      <BottomText>{bottomText ?? " "}</BottomText>
    </Wrapper>
  );
}

export default React.memo(Match);
