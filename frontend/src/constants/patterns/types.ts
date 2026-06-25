import type { ChordNote } from "../CagedChords";

export interface Pattern {
  id: string;
  name: string;
  notes: ChordNote[]; // defined in key of A, in playback order
}
