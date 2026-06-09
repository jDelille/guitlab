import type { ChordNote } from "../CagedChords";
import type { ShapePatterns } from "../../types/ShapePatters";

const CHROMATIC = [
  "C",
  "C#",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;
export type NoteName = (typeof CHROMATIC)[number];

// How many semitones above C is each key
const KEY_OFFSETS: Record<string, number> = {
  C: 0,
  "C#": 1,
  D: 2,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  Ab: 8,
  A: 9,
  Bb: 10,
  B: 11,
};

// Open string notes by string index (5=low E, 0=high e)
const OPEN_STRINGS: Record<number, number> = {
  5: 4, // E
  4: 9, // A
  3: 2, // D
  2: 7, // G
  1: 11, // B
  0: 4, // E
};

function transposeNote(note: NoteName, semitones: number): NoteName {
  const index = CHROMATIC.indexOf(note);
  return CHROMATIC[(index + semitones) % 12] as NoteName;
}

function isOpenString(string: number, fret: number, offset: number): boolean {
  // A fret is "truly open" if it would still be fret 0 after shifting
  // i.e. the note matches what the open string produces at the target key
  return fret - offset === 0;
}

export function resolveShapeForKey(
  base: ShapePatterns,
  key: string,
): ShapePatterns {
  const offset = KEY_OFFSETS[key];

  const resolvePattern = (notes: ChordNote[]): ChordNote[] =>
    notes.map((n): ChordNote => {
      if (n.isMuted || n.fret === null || n.note === null) return n;

      return {
        ...n,
        fret: n.fret + offset,
        note: transposeNote(n.note as NoteName, offset),
      };
    });

  return {
    arpeggio: resolvePattern(base.arpeggio),
    majorPentatonic: resolvePattern(base.majorPentatonic),
    majorScale: resolvePattern(base.majorScale),
    minorChord: resolvePattern(base.minorChord),
    minorArpeggio: resolvePattern(base.minorArpeggio),
    minorPentatonic: resolvePattern(base.minorPentatonic),
    minorScale: resolvePattern(base.minorScale),
    dom7Chord: resolvePattern(base.dom7Chord),
    dom7Arpeggio: resolvePattern(base.dom7Arpeggio),
    dom7Scale: resolvePattern(base.dom7Scale),
  };
}
