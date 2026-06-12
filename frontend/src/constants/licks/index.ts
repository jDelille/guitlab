import type { ShapeName } from "../CagedChords";
import type { Scales } from "../../types/Scales";
import type { Lick } from "./types";
import { SHAPE_ROOT_FRETS } from "../shapeRootFrets";
import { E_SHAPE_LICKS } from "./eLicks";

const ALL_LICKS: Lick[] = [...E_SHAPE_LICKS];

export function getLicksForShape(
  shape: ShapeName,
  scale: Scales,
  key: string
): Lick[] {
  const offset = SHAPE_ROOT_FRETS[shape][key] - SHAPE_ROOT_FRETS[shape]["C"];

  return ALL_LICKS
    .filter((lick) => lick.shape === shape && lick.scale === scale)
    .map((lick) => ({
      ...lick,
      notes: lick.notes.map((n) => ({ ...n, fret: n.fret! + offset })),
    }));
}
