export function calculateSVGDimensions(
  numOfRows: number,
  numOfColumns: number,
  rowHeight: number,
  columnWidth: number,
  canvasPadding: number,
  roundHeader: any,
  currentRound: string = "",
) {
  const bracketHeight = numOfRows * rowHeight;
  const bracketWidth = numOfColumns * columnWidth;

  // console.log(
  //   "Calculated bracket height dimensions:",
  //   numOfRows,
  //   bracketHeight,
  //   canvasPadding,
  //   roundHeader.height,
  //   roundHeader.marginBottom,
  // );

  // console.log(
  //   "Calculated bracket width dimensions:",
  //   bracketWidth,
  //   canvasPadding,
  // );

  const gameHeight =
    bracketHeight * 1.25 +
    canvasPadding * 2 +
    (roundHeader.isShown ? roundHeader.height + roundHeader.marginBottom : 0);
  const gameWidth = bracketWidth + canvasPadding * 2;
  const startPosition = [
    currentRound
      ? -(parseInt(currentRound, 10) * columnWidth - canvasPadding * 2)
      : 0,
    0,
  ];
  return { gameWidth, gameHeight, startPosition };
}
