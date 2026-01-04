import React, { useContext } from "react";
import { defaultStyle, getCalculatedStyles } from "../settings";
import {
  ComputedOptions,
  MatchComponentProps,
  Match as MatchType,
  Participant,
} from "../types";
import { matchContext } from "./match-context";
import { sortTeamsSeedOrder } from "./match-functions";
import { MATCH_STATES } from "./match-states";

type MatchProps = {
  rowIndex: number;
  columnIndex: number;
  match: MatchType;
  previousBottomMatch?: MatchType | null;
  teams: Participant[];
  topText: string;
  bottomText: string;
  style?: ComputedOptions;
  matchComponent: React.ComponentType<MatchComponentProps>;
  onMatchClick?: (args: {
    match: MatchType;
    topWon: boolean;
    bottomWon: boolean;
  }) => void;
  onPartyClick?: (party: Participant, partyWon: boolean) => void;
  lateEntryParticipantIds?: Set<string | number>;
  [key: string]: any;
};

function Match({
  rowIndex,
  columnIndex,
  match,
  previousBottomMatch = null,
  teams,
  topText,
  bottomText,
  style = defaultStyle,
  matchComponent: MatchComponent,
  onMatchClick,
  onPartyClick,
  lateEntryParticipantIds = new Set(),
  ...rest
}: MatchProps) {
  const {
    state: { hoveredPartyId },
    dispatch,
  } = useContext(matchContext) as unknown as {
    state: { hoveredPartyId: string | number | null };
    dispatch: (action: any) => void;
  };
  const computedStyles = getCalculatedStyles(style);
  const { width = 300, boxHeight = 70, connectorColor } = computedStyles;
  const sortedTeams = teams.sort(sortTeamsSeedOrder(previousBottomMatch));

  const topParty: Participant = sortedTeams?.[0]
    ? sortedTeams[0]
    : { id: "", name: "" };
  const bottomParty: Participant = sortedTeams?.[1]
    ? sortedTeams[1]
    : { id: "", name: "" };

  const topHovered =
    !Number.isNaN(hoveredPartyId) &&
    topParty?.id !== undefined &&
    hoveredPartyId === topParty.id;
  const bottomHovered =
    !Number.isNaN(hoveredPartyId) &&
    bottomParty?.id !== undefined &&
    hoveredPartyId === bottomParty.id;

  const participantWalkedOver = (participant: Participant) =>
    match.state === MATCH_STATES.WALK_OVER &&
    teams.filter((team: Participant) => !!team.id).length < 2 &&
    !!participant.id;

  // Lower placement is better
  const topWon =
    topParty.status === MATCH_STATES.WALK_OVER ||
    participantWalkedOver(topParty) ||
    !!topParty.isWinner;
  const bottomWon =
    bottomParty.status === MATCH_STATES.WALK_OVER ||
    participantWalkedOver(bottomParty) ||
    !!bottomParty.isWinner;

  const matchState = MATCH_STATES[match.state as keyof typeof MATCH_STATES];

  const teamNameFallback =
    {
      [MATCH_STATES.WALK_OVER]: "",
      [MATCH_STATES.NO_SHOW]: "",
      [MATCH_STATES.DONE]: "",
      [MATCH_STATES.SCORE_DONE]: "",
      [MATCH_STATES.NO_PARTY]: "",
    }[matchState] ?? "TBD";

  const resultFallback = (participant: Participant) => {
    if (participant.status) {
      return (
        {
          WALKOVER: computedStyles.wonBywalkOverText,
          [MATCH_STATES.WALK_OVER]: computedStyles.wonBywalkOverText,
          [MATCH_STATES.NO_SHOW]: computedStyles.lostByNoShowText,
          [MATCH_STATES.NO_PARTY]: "",
        }[participant.status] ?? ""
      );
    }

    if (participantWalkedOver(participant)) {
      return computedStyles.wonBywalkOverText;
    }
    return "";
  };

  const onMouseEnter = (partyId: string | number) => {
    dispatch({
      type: "SET_HOVERED_PARTYID",
      payload: {
        partyId,
        matchId: match.id,
        rowIndex,
        columnIndex,
      },
    });
  };
  const onMouseLeave = () => {
    dispatch({ type: "SET_HOVERED_PARTYID", payload: null });
  };

  bottomParty.name = bottomParty.name || teamNameFallback;
  bottomParty.resultText =
    bottomParty.resultText || resultFallback(bottomParty);
  topParty.name = topParty.name || teamNameFallback;
  topParty.resultText = topParty.resultText || resultFallback(topParty);

  // Wrapper to match MatchComponentProps signature
  const handleMatchClick = (args: {
    match: MatchType;
    topWon: boolean;
    bottomWon: boolean;
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
  }) => {
    if (onMatchClick) {
      onMatchClick({
        match: args.match,
        topWon: args.topWon,
        bottomWon: args.bottomWon,
      });
    }
  };

  const handlePartyClick = (party: Participant, partyWon: boolean) => {
    if (onPartyClick) {
      onPartyClick(party, partyWon);
    }
  };

  return (
    <svg
      width={width}
      height={boxHeight}
      viewBox={`0 0 ${width} ${boxHeight}`}
      {...rest}
    >
      <foreignObject x={0} y={0} width={width} height={boxHeight}>
        {/* TODO: Add OnClick Match handler */}
        {MatchComponent && (
          <MatchComponent
            {...{
              match,
              onMatchClick: handleMatchClick,
              onPartyClick: handlePartyClick,
              onMouseEnter,
              onMouseLeave,
              topParty,
              bottomParty,
              topWon,
              bottomWon,
              topHovered,
              bottomHovered,
              topText,
              bottomText,
              connectorColor,
              computedStyles,
              teamNameFallback,
              resultFallback,
              isTopPartyLateEntry: lateEntryParticipantIds.has(topParty?.id),
              isBottomPartyLateEntry: lateEntryParticipantIds.has(
                bottomParty?.id,
              ),
            }}
          />
        )}
      </foreignObject>
    </svg>
  );
}

export default Match;
