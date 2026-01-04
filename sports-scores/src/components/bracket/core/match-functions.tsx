import { sortAlphanumerically } from '../utils/string';

export const sortTeamsSeedOrder = (previousBottomMatch: any): any => {
  return (partyA, partyB) => {
    const partyAInBottomMatch = previousBottomMatch?.participants?.find(
      p => p.id === partyA.id
    );

    const partyBInBottomMatch = previousBottomMatch?.participants?.find(
      p => p.id === partyB.id
    );

    if (partyAInBottomMatch) {
      return 1;
    }
    if (partyBInBottomMatch) {
      return -1;
    }
    return 0;
  };
};
