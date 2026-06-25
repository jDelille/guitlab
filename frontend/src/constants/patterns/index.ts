import type { Pattern } from "./types";
import { MINOR_145_PATTERN } from "./minor145";

const KEY_OFFSET: Record<string, number> = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3,
  E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8,
  Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
};

export function getPatternForKey(pattern: Pattern, key: string): Pattern {
  const offset = KEY_OFFSET[key] - KEY_OFFSET["A"];
  return {
    ...pattern,
    notes: pattern.notes.map((n) => {
      if (n.fret === null) return n;
      let fret = n.fret + offset;
      if (fret < 0) fret += 12;
      return { ...n, fret };
    }),
  };
}

export const MINOR_145 = MINOR_145_PATTERN;
