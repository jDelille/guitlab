import type { ChordNote } from "../constants/CagedChords";

export interface ShapePatterns {
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