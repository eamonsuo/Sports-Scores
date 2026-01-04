export const sortTeamsSeedOrder = (previousBottomMatch: any): any => {
  return (partyA: any, partyB: any) => {
    const partyAInBottomMatch = previousBottomMatch?.participants?.find(
      (p: any) => p.id === partyA.id,
    );

    const partyBInBottomMatch = previousBottomMatch?.participants?.find(
      (p: any) => p.id === partyB.id,
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
