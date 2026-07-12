import type { ChordNote, ShapeName } from "../CagedChords";
import type { Scales } from "../../types/Scales";

export interface Lick {
  id: string;
  name: string;
  shape: ShapeName;
  scale: Scales;
  notes: ChordNote[]; // defined in key of C base position, in playback order
  techniques?: {
    [noteIndex: number]: {
      technique: "bend" | "slide" | "hammer-on" | "pull-off";
      bend?: {
        amount: number; // in semitones
        duration: number; // in milliseconds
      };
      slide?: {
        toFret: number;
        duration: number; // in milliseconds
      };
      hammerOn?: {
        toFret: number;
        duration: number; // in milliseconds
      };
      pullOff?: {
        toFret: number;
        duration: number; // in milliseconds
      };
    };
  };
}
