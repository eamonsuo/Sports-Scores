import { useContext } from "react";
import { matchContext } from "../core/match-context";
import { Match } from "../types";

type BracketSnippet = {
  previousTopMatch?: Match;
  previousBottomMatch?: Match;
  currentMatch?: Match;
};

type UseMatchHighlightContextProps = {
  bracketSnippet?: BracketSnippet | null;
};

const useMatchHighlightContext = ({
  bracketSnippet = null,
}: UseMatchHighlightContextProps) => {
  const {
    state: { hoveredPartyId },
  } = useContext(matchContext) as unknown as {
    state: { hoveredPartyId: string | number | null };
  };
  const previousTopMatch = bracketSnippet?.previousTopMatch;
  const previousBottomMatch = bracketSnippet?.previousBottomMatch;
  const currentMatch = bracketSnippet?.currentMatch;

  const topHighlighted =
    currentMatch?.participants?.some(
      (p: { id: string | number }) => p.id === hoveredPartyId,
    ) &&
    previousTopMatch?.participants?.some(
      (p: { id: string | number }) => p.id === hoveredPartyId,
    );

  const bottomHighlighted =
    currentMatch?.participants?.some(
      (p: { id: string | number }) => p.id === hoveredPartyId,
    ) &&
    previousBottomMatch?.participants?.some(
      (p: { id: string | number }) => p.id === hoveredPartyId,
    );
  return { topHighlighted, bottomHighlighted };
};

export default useMatchHighlightContext;
