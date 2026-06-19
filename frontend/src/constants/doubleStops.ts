import GuitarConstants from "./GuitarConstants";

export interface DoubleStopPair {
  strings: [number, number]; // [string1, string2] — 0=high e, 1=B, 2=G, 3=D, 4=A, 5=low E
  frets: [number, number]; // [fret on string1, fret on string2] in key of C
}

// Template in key of C
export const DOUBLE_STOPS_C: DoubleStopPair[] = [
  // B + high e string pattern
  { strings: [1, 0], frets: [13, 12] },
  { strings: [1, 0], frets: [15, 13] },
  { strings: [1, 0], frets: [17, 15] },

  // G + high e string  pattern
  { strings: [2, 0], frets: [9, 8] },
  { strings: [2, 0], frets: [10, 10] },
  { strings: [2, 0], frets: [12, 12] },

  // D + b  pattern
  { strings: [3, 1], frets: [2, 1] },
  { strings: [3, 1], frets: [3, 3] },
  { strings: [3, 1], frets: [5, 5] },

  // // A + g  pattern
  // { strings: [4, 2], frets: [7, 5] },
  // { strings: [4, 2], frets: [8, 7] },
  // { strings: [4, 2], frets: [10, 9] },
];

// Semitone offset from C to the target key, based on high e string (string 0)
function getTransposeOffset(key: string): number {
  const NOTES = GuitarConstants.notesSharp;
  const NOTES_FLAT = GuitarConstants.notesFlat;
  const rootIndex =
    NOTES.indexOf(key) !== -1 ? NOTES.indexOf(key) : NOTES_FLAT.indexOf(key);
  if (rootIndex === -1) return 0;

  const cIndex = NOTES.indexOf("C"); // 3
  const openString0 = GuitarConstants.tuning[0][0]; // standard tuning, high e = 7

  const cFret = (cIndex - openString0 + 12) % 12; // C on high e
  const rootFret = (rootIndex - openString0 + 12) % 12; // target key on high e

  return rootFret - cFret; 
}

export function getDoubleStopsForKey(key: string): DoubleStopPair[] {
  const offset = getTransposeOffset(key);

  return DOUBLE_STOPS_C.map((pair) => ({
    strings: pair.strings,
    frets: [pair.frets[0] + offset, pair.frets[1] + offset] as [number, number],
  })).filter(
    ({ frets }) =>
      frets[0] >= 0 && frets[0] <= 20 && frets[1] >= 0 && frets[1] <= 20,
  );
}
