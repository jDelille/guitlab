import type { ShapeName } from "../../constants/CagedChords";

export const STRING_COUNT = 6;
export const FRET_COUNT = 4;
export const STRING_SPACING = 18;
export const FRET_SPACING = 20;
export const DOT_RADIUS = 7;
export const NUT_WIDTH = 3;
export const PAD_LEFT = 22;
export const PAD_TOP = 18;
export const PAD_BOTTOM = 10;

export const DIAGRAM_W =
  (STRING_COUNT - 1) * STRING_SPACING + PAD_LEFT + 14;

export const DIAGRAM_H =
  FRET_COUNT * FRET_SPACING + PAD_TOP + PAD_BOTTOM;

export const GRID_W =
  (STRING_COUNT - 1) * STRING_SPACING;

export const GRID_H =
  FRET_COUNT * FRET_SPACING;

export const SHAPE_COLORS: Record<ShapeName, string> = {
  C: "#34D399",
  A: "#A78BFA",
  G: "#F59E0B",
  E: "#60A5FA",
  D: "#F87171",
};


export const SHAPE_ORDER: ShapeName[] = [
  'C',
  'A',
  'G',
  'E',
  'D',
];