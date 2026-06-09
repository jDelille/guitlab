import type { ShapeName } from "../CagedChords";

export interface ChordNoteTemplate {
  string: number;
  fret: number | null;
  degree: "R" | 2 | 3 | 4 | 5 | 6 | 7 | "b3" | "b7" | null;
  isRoot: boolean;
  isMuted: boolean;
}

export interface ChordTemplate {
  shape: ShapeName;
  baseFret: number;
  barre: { fret: number; fromString: number; toString: number } | null;
  notes: ChordNoteTemplate[];
}

export const CHORD_TEMPLATES: Record<ShapeName, ChordTemplate> = {
  C: {
    shape: "C",
    baseFret: 0,
    barre: null,
    notes: [
      { string: 0, fret: null, degree: null, isRoot: false, isMuted: true },
      { string: 1, fret: 3, degree: "R", isRoot: true, isMuted: false },
      { string: 2, fret: 2, degree: 3, isRoot: false, isMuted: false },
      { string: 3, fret: 0, degree: 5, isRoot: false, isMuted: false },
      { string: 4, fret: 1, degree: "R", isRoot: true, isMuted: false },
      { string: 5, fret: 0, degree: 3, isRoot: false, isMuted: false },
    ],
  },
  A: {
    shape: "A",
    baseFret: 3,
    barre: { fret: 3, fromString: 1, toString: 5 },
    notes: [
      { string: 0, fret: null, degree: null, isRoot: false, isMuted: true },
      { string: 1, fret: 3, degree: "R", isRoot: true, isMuted: false },
      { string: 2, fret: 5, degree: 3, isRoot: false, isMuted: false },
      { string: 3, fret: 5, degree: "R", isRoot: true, isMuted: false },
      { string: 4, fret: 5, degree: 5, isRoot: false, isMuted: false },
      { string: 5, fret: 3, degree: "R", isRoot: true, isMuted: false },
    ],
  },
  G: {
    shape: "G",
    baseFret: 5,
    barre: null,
    notes: [
      { string: 0, fret: 8, degree: "R", isRoot: true, isMuted: false },
      { string: 1, fret: 8, degree: 5, isRoot: false, isMuted: false },
      { string: 2, fret: 7, degree: 3, isRoot: false, isMuted: false },
      { string: 3, fret: 5, degree: 5, isRoot: false, isMuted: false },
      { string: 4, fret: 5, degree: "R", isRoot: true, isMuted: false },
      { string: 5, fret: 8, degree: "R", isRoot: true, isMuted: false },
    ],
  },
  E: {
    shape: "E",
    baseFret: 8,
    barre: { fret: 8, fromString: 0, toString: 5 },
    notes: [
      { string: 0, fret: 8, degree: "R", isRoot: true, isMuted: false },
      { string: 1, fret: 10, degree: 5, isRoot: false, isMuted: false },
      { string: 2, fret: 10, degree: 3, isRoot: false, isMuted: false },
      { string: 3, fret: 9, degree: "R", isRoot: true, isMuted: false },
      { string: 4, fret: 8, degree: 5, isRoot: false, isMuted: false },
      { string: 5, fret: 8, degree: "R", isRoot: true, isMuted: false },
    ],
  },
  D: {
    shape: "D",
    baseFret: 10,
    barre: null,
    notes: [
      { string: 0, fret: null, degree: null, isRoot: false, isMuted: true },
      { string: 1, fret: null, degree: null, isRoot: false, isMuted: true },
      { string: 2, fret: 10, degree: "R", isRoot: true, isMuted: false },
      { string: 3, fret: 12, degree: 5, isRoot: false, isMuted: false },
      { string: 4, fret: 13, degree: "R", isRoot: true, isMuted: false },
      { string: 5, fret: 12, degree: 3, isRoot: false, isMuted: false },
    ],
  },
};
