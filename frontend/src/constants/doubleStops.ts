import GuitarConstants from "./GuitarConstants";

export interface DoubleStopPair {
  strings: [number, number]; // [string1, string2] — 0=high e, 1=B, 2=G, 3=D, 4=A, 5=low E
  frets: [number, number]; // [fret on string1, fret on string2] in key of C
}

// Template in key of C major
export const DOUBLE_STOPS_C: DoubleStopPair[] = [
  // B + high e
  { strings: [1, 0], frets: [13, 12] }, // C–E
  { strings: [1, 0], frets: [15, 13] }, // D–F
  { strings: [1, 0], frets: [17, 15] }, // E–G

  // G + high e
  { strings: [2, 0], frets: [9, 8] },   // E–C
  { strings: [2, 0], frets: [10, 10] }, // F–D
  { strings: [2, 0], frets: [12, 12] }, // G–E

  // D + B
  { strings: [3, 1], frets: [2, 1] },   // E–C
  { strings: [3, 1], frets: [3, 3] },   // F–D
  { strings: [3, 1], frets: [5, 5] },   // G–E
];

// Template in key of C minor — only the b3 (E→Eb) changes in these pairs
export const DOUBLE_STOPS_C_MINOR: DoubleStopPair[] = [
  // B + high e
  { strings: [1, 0], frets: [13, 11] }, // C–Eb
  { strings: [1, 0], frets: [15, 13] }, // D–F  (unchanged)
  { strings: [1, 0], frets: [16, 15] }, // Eb–G

  // G + high e
  { strings: [2, 0], frets: [8, 8] },   // Eb–C
  { strings: [2, 0], frets: [10, 10] }, // F–D  (unchanged)
  { strings: [2, 0], frets: [12, 11] }, // G–Eb

  // D + B
  { strings: [3, 1], frets: [1, 1] },   // Eb–C
  { strings: [3, 1], frets: [3, 3] },   // F–D  (unchanged)
  { strings: [3, 1], frets: [5, 4] },   // G–Eb
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

const MINOR_SCALES = new Set(["minorScale", "minorPentatonic", "minorArpeggio"]);

export function getDoubleStopsForKey(key: string, scale = "majorScale"): DoubleStopPair[] {
  const offset = getTransposeOffset(key);
  const template = MINOR_SCALES.has(scale) ? DOUBLE_STOPS_C_MINOR : DOUBLE_STOPS_C;

  return template.map((pair) => ({
    strings: pair.strings,
    frets: [pair.frets[0] + offset, pair.frets[1] + offset] as [number, number],
  })).filter(
    ({ frets }) =>
      frets[0] >= 0 && frets[0] <= 20 && frets[1] >= 0 && frets[1] <= 20,
  );
}
