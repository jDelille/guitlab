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

/**
 * Shifts a note name up by the given number of semitones, wrapping around the chromatic scale.
 * @param note - The starting note name.
 * @param semitones - Number of semitones to transpose up.
 * @returns The transposed note name.
 */
function transposeNote(note: NoteName, semitones: number): NoteName {
  const index = CHROMATIC.indexOf(note);
  return CHROMATIC[(index + semitones) % 12] as NoteName;
}

/**
 * Determines whether a fret position represents a true open string after applying a key offset.
 * @param string - The string index (0 = high e, 5 = low E).
 * @param fret - The fret number in the shape pattern.
 * @param offset - The semitone offset for the target key.
 * @returns True if the note would be played as an open string in the target key.
 */
function isOpenString(string: number, fret: number, offset: number): boolean {
  // A fret is "truly open" if it would still be fret 0 after shifting
  // i.e. the note matches what the open string produces at the target key
  return fret - offset === 0;
}

/**
 * Transposes all patterns in a CAGED shape from its base key (C) to the given target key.
 * Each note's fret number and note name are shifted by the key's semitone offset.
 * Muted or null notes are passed through unchanged.
 * @param base - The shape patterns defined in the key of C.
 * @param key - The target key to transpose to (e.g. "G", "F#", "Bb").
 * @returns A new ShapePatterns object with all notes transposed to the target key.
 */
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
