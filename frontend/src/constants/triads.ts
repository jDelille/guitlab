import GuitarConstants from "./GuitarConstants";

export type CagedShape = "C" | "A" | "G" | "E" | "D";

export interface Triad {
  shape: CagedShape;
  strings: [number, number, number]; // [string1, string2, string3] — 0=high e, 1=B, 2=G, 3=D, 4=A, 5=low E
  frets: [number, number, number]; // [fret1, fret2, fret3] in key of C
}

// Template in key of C
export const TRIADS_C: Triad[] = [
  // C shape triads
  { shape: "C", strings: [0, 1, 2], frets: [0, 1, 0] },
  { shape: "C", strings: [1, 2, 3], frets: [1, 0, 2] },
  { shape: "C", strings: [2, 3, 4], frets: [0, 2, 3] },
  { shape: "C", strings: [3, 4, 5], frets: [2, 3, 3] },

  // A shape triads
  { shape: "A", strings: [0, 1, 2], frets: [3, 5, 5] },
  { shape: "A", strings: [1, 2, 3], frets: [5, 5, 5] },

  // G shape triads
  { shape: "G", strings: [1, 2, 3], frets: [5, 5, 5] },
  { shape: "G", strings: [2, 3, 4], frets: [5, 5, 7] },
  { shape: "G", strings: [3, 4, 5], frets: [5, 7, 8] },

  // E shape triads
  { shape: "E", strings: [0, 1, 2], frets: [8, 8, 9] },
  { shape: "E", strings: [1, 2, 3], frets: [8, 9, 10] },
  { shape: "E", strings: [2, 3, 4], frets: [9, 10, 10] },

  // D shape triads
  { shape: "D", strings: [0, 1, 2], frets: [12, 13, 12] },
  { shape: "D", strings: [3, 4, 5], frets: [10, 10, 12] },

];

function getTransposeOffset(key: string): number {
  const NOTES = GuitarConstants.notesSharp;
  const NOTES_FLAT = GuitarConstants.notesFlat;
  const rootIndex =
    NOTES.indexOf(key) !== -1 ? NOTES.indexOf(key) : NOTES_FLAT.indexOf(key);
  if (rootIndex === -1) return 0;

  const cIndex = NOTES.indexOf("C");
  const openString0 = GuitarConstants.tuning[0][0]; // standard tuning, high e = 7

  const cFret = (cIndex - openString0 + 12) % 12;
  const rootFret = (rootIndex - openString0 + 12) % 12;

  return rootFret - cFret;
}

export function getTriadsForKey(key: string, shape?: CagedShape): Triad[] {
  const offset = getTransposeOffset(key);
  const results: Triad[] = [];

  TRIADS_C.filter((t) => !shape || t.shape === shape).forEach((triad) => {
    [0, 12].forEach((octaveShift) => {
      const frets = triad.frets.map((f) => f + offset + octaveShift) as [number, number, number];
      if (frets.every((f) => f >= 0 && f <= 20)) {
        results.push({ shape: triad.shape, strings: triad.strings, frets });
      }
    });
  });

  return results;
}
