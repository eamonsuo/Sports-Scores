import { ComputedOptions, Options } from "./types";

export const defaultStyle: Options = {
  width: 300,
  boxHeight: 110,
  canvasPadding: 25,
  spaceBetweenColumns: 50,
  spaceBetweenRows: 50,
  connectorColor: "rgb(47, 54, 72)",
  connectorColorHighlight: "#DDD",
  roundHeader: {
    isShown: true,
    height: 40,
    marginBottom: 25,
    fontSize: 16,
    fontColor: "white",
    backgroundColor: "rgb(47, 54, 72)",
    fontFamily: '"Roboto", "Arial", "Helvetica", "sans-serif"',
    roundTextGenerator: undefined,
  },
  roundSeparatorWidth: 24,
  lineInfo: {
    separation: -13,
    homeVisitorSpread: 0.5,
  },
  horizontalOffset: 13,
  wonBywalkOverText: "WO",
  lostByNoShowText: "NS",
};

export const getCalculatedStyles = (
  style = defaultStyle,
): Required<ComputedOptions> => {
  const mergedStyle = { ...defaultStyle, ...style };
  const {
    boxHeight = defaultStyle.boxHeight!,
    width = defaultStyle.width!,
    spaceBetweenColumns = defaultStyle.spaceBetweenColumns!,
    spaceBetweenRows = defaultStyle.spaceBetweenRows!,
  } = mergedStyle;
  const columnWidth = width + spaceBetweenColumns;
  const rowHeight = boxHeight + spaceBetweenRows;
  return {
    ...mergedStyle,
    rowHeight,
    columnWidth,
    roundHeader: {
      ...defaultStyle.roundHeader!,
      ...mergedStyle.roundHeader,
    },
    lineInfo: {
      ...defaultStyle.lineInfo!,
      ...mergedStyle.lineInfo,
    },
  } as Required<ComputedOptions>;
};
