import type { ChordNote } from "../constants/CagedChords";

const MIDI_TUNING = [64, 59, 55, 50, 45, 40];

export interface PlayNote {
  midi: number;
  string: number;
  fret: number;
}

export function chordNotesToMidi(notes: ChordNote[]) {
  return notes
    .filter((n) => n.fret !== null)
    .map((n) => MIDI_TUNING[n.string] + n.fret!);
}

export function chordNotesToPlayNotes(notes: ChordNote[]): PlayNote[] {
  return notes
    .filter((n) => n.fret !== null)
    .map((n) => ({
      midi: MIDI_TUNING[n.string] + n.fret!,
      string: n.string,
      fret: n.fret!,
    }))
    .sort((a, b) => a.midi - b.midi);
}

// Like chordNotesToPlayNotes but preserves array order - used for lick playback.
export function lickToPlayNotes(notes: ChordNote[]): PlayNote[] {
  return notes
    .filter((n) => n.fret !== null && !n.isMuted)
    .map((n) => ({
      midi: MIDI_TUNING[n.string] + n.fret!,
      string: n.string,
      fret: n.fret!,
    }));
}