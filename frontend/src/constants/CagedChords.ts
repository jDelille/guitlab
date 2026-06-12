import { buildCagedChords } from "../utils/buildCagedChords";

export type NoteName =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B";

export type ShapeName = "C" | "A" | "G" | "E" | "D";

export interface ChordNote {
  string: number; // 0 = low E, 5 = high e
  fret: number | null; // null = open string
  note?: NoteName | null;
  isRoot: boolean;
  isMuted: boolean;
  degree?: number | string | null;
  isOctaveExtension?: boolean;
}

export interface Barre {
  fret: number;
  fromString: number;
  toString: number;
}

export interface ChordShape {
  shape: ShapeName;
  baseFret: number;
  barre: Barre | null;
  notes: ChordNote[];
  color?: string;
  arpeggio: ChordNote[];
  majorPentatonic: ChordNote[];
  majorScale: ChordNote[];
  minorChord: ChordNote[];
  minorArpeggio: ChordNote[];
  minorPentatonic: ChordNote[];
  minorScale: ChordNote[];
  dom7Chord: ChordNote[];
  dom7Arpeggio: ChordNote[];
  dom7Scale: ChordNote[];
}

export function withAlpha(hex: string, alpha: number) {
  const clean = hex.replace("#", "");

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type CagedKeyData = Record<ShapeName, ChordShape>;

export function getShapesForKey(key: string): CagedKeyData {
  return buildCagedChords(key);
}

export function getShape(key: string, shape: ShapeName): ChordShape {
  return buildCagedChords(key)[shape];
}

export const isMuted = (note: ChordNote) => note.isMuted;

export const isOpen = (note: ChordNote) => note.fret === 0;
