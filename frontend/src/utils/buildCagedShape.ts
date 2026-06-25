import { A_SHAPE_BASE } from "../constants/shapes/aShape";
import { C_SHAPE_BASE } from "../constants/shapes/cShape";
import { D_SHAPE_BASE } from "../constants/shapes/dShape";
import { E_SHAPE_BASE } from "../constants/shapes/eShape";
import { G_SHAPE_BASE } from "../constants/shapes/gShape";
import getNoteFromDegree from "./getNoteFromDegree";

const SHAPE_MAP: Record<string, any> = {
  A: A_SHAPE_BASE,
  C: C_SHAPE_BASE,
  G: G_SHAPE_BASE,
  E: E_SHAPE_BASE,
  D: D_SHAPE_BASE,
};

export function buildCagedShape(
  root: string,
  shape: keyof typeof SHAPE_MAP,
  offset: number = 0,
) {
  const base = SHAPE_MAP[shape];

  if (!base) {
    throw new Error(`Unknown shape: ${shape}`);
  }

  const applyKeyToShape = (arr: any[], noOctaves = false) => {
    const notes: any[] = [];

    arr
      .map((n) => ({
        ...n,
        fret: n.fret !== null ? n.fret + offset : null,
        note: getNoteFromDegree(root, n.degree),
      }))
      .forEach((n) => {
        notes.push(n);
        if (!noOctaves && n.fret !== null && n.fret + 12 <= 20) {
          notes.push({ ...n, fret: n.fret + 12, isOctaveExtension: true });
        }
      });

    return notes;
  };

  return {
    arpeggio: applyKeyToShape(base.arpeggio),
    majorPentatonic: applyKeyToShape(base.majorPentatonic),
    majorScale: applyKeyToShape(base.majorScale),
    minorChord: applyKeyToShape(base.minorChord),
    minorArpeggio: applyKeyToShape(base.minorArpeggio),
    minorPentatonic: applyKeyToShape(base.minorPentatonic),
    minorScale: applyKeyToShape(base.minorScale),
    dom7Chord: applyKeyToShape(base.dom7Chord, true),
    dom7Arpeggio: applyKeyToShape(base.dom7Arpeggio),
    dom7Scale: applyKeyToShape(base.dom7Scale),
  };
}
