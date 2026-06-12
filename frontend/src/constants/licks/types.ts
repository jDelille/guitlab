import type { ChordNote, ShapeName } from "../CagedChords";
import type { Scales } from "../../types/Scales";

export interface Lick {
  id: string;
  name: string;
  shape: ShapeName;
  scale: Scales;
  notes: ChordNote[]; // defined in key of C base position, in playback order
}
