import { getShapesForKey, withAlpha, type ShapeName, type ChordNote } from "../../constants/CagedChords";
import { SHAPE_COLORS } from "../chords/constants";
import { getInstrument } from "../../audio/soundfont";
import GuitarConstants from "../../constants/GuitarConstants";
import type { Scales } from "../../types/Scales";

export const NOTES = GuitarConstants.notesSharp;
export const STANDARD_TUNING = GuitarConstants.tuning[0];
export const MIDI_TUNING = [64, 59, 55, 50, 45, 40];
export const TRIAD_COLOR = "39,174,96";
export const NUT_WIDTH = 75;
export const STRING_ROW_H = 35;
export const NOTE_RADIUS = 12.5;
export const SHAPE_ORDER: ShapeName[] = ["C", "A", "G", "E", "D"];

export const DEGREE_LABELS: Record<number, string> = {
  0: "R", 1: "b2", 2: "2", 3: "b3", 4: "3", 5: "4",
  6: "b5", 7: "5", 8: "b6", 9: "6", 10: "b7", 11: "7",
};

export type NoteMapEntry = { note: any; colors: string[]; dimColors: string[] };

export function getFretCenterX(fret: number, containerW: number): number {
  const fw = (containerW - NUT_WIDTH) / 20;
  return fret === 0 ? NUT_WIDTH / 2 : NUT_WIDTH + (fret - 0.5) * fw;
}

export function getStringCenterY(stringIndex: number): number {
  return stringIndex * STRING_ROW_H + STRING_ROW_H / 2;
}

export async function playNote(string: number, fret: number) {
  const instrument = await getInstrument();
  instrument.start({ note: MIDI_TUNING[string] + fret });
}

export function getNoteName(string: number, fret: number): string {
  const open = STANDARD_TUNING[string];
  return NOTES[(open + fret) % 12];
}

export function getDegree(string: number, fret: number, keyName: string): string {
  const notePitch = (STANDARD_TUNING[string] + fret) % 12;
  const rootPitch =
    NOTES.indexOf(keyName) !== -1
      ? NOTES.indexOf(keyName)
      : GuitarConstants.notesFlat.indexOf(keyName);
  if (rootPitch === -1) return "";
  return DEGREE_LABELS[(notePitch - rootPitch + 12) % 12] ?? "";
}

export function buildShapeNoteMap(
  allShapes: ReturnType<typeof getShapesForKey>,
  shapeNames: ShapeName[],
  scale: string,
): Map<string, NoteMapEntry> {
  const intermediate = new Map<
    string,
    { note: any; entries: { color: string; dimColor: string; effectiveBaseFret: number }[] }
  >();

  shapeNames.forEach((shapeName) => {
    const shapeColor = SHAPE_COLORS[shapeName];
    const dim = withAlpha(shapeColor, 0.55);
    const baseFret = allShapes[shapeName].baseFret;
    allShapes[shapeName][scale as Scales].forEach((note: ChordNote) => {
      const key = `${note.string}-${note.fret}`;
      const effectiveBaseFret = note.isOctaveExtension ? baseFret + 12 : baseFret;
      const existing = intermediate.get(key);
      if (existing) {
        existing.entries.push({ color: shapeColor, dimColor: dim, effectiveBaseFret });
      } else {
        intermediate.set(key, { note, entries: [{ color: shapeColor, dimColor: dim, effectiveBaseFret }] });
      }
    });
  });

  const map = new Map<string, NoteMapEntry>();
  intermediate.forEach((value, key) => {
    const sorted = [...value.entries].sort((a, b) => a.effectiveBaseFret - b.effectiveBaseFret);
    map.set(key, {
      note: value.note,
      colors: sorted.map((e) => e.color),
      dimColors: sorted.map((e) => e.dimColor),
    });
  });

  return map;
}

export function toGradient(cols: string[]): string {
  return cols.length > 1
    ? `linear-gradient(to right, ${cols.map((c, i) => `${c} ${i * (100 / cols.length)}%, ${c} ${(i + 1) * (100 / cols.length)}%`).join(", ")})`
    : cols[0];
}

export function getNoteBackground(params: {
  isLickNote: boolean;
  isActive: boolean;
  isDoubleStop: boolean;
  isTriad: boolean;
  isTriadPlaying: boolean;
  isActiveTriad: boolean;
  isInsideBracket: boolean;
  noteData: any;
  noteColor: string;
  noteDimColor: string;
}): string {
  const { isLickNote, isActive, isDoubleStop, isTriad, isTriadPlaying, isActiveTriad, isInsideBracket, noteData, noteColor, noteDimColor } = params;
  if (isLickNote && !isActive) return "rgba(251,191,36,0.15)";
  if (isDoubleStop) return "rgba(155,89,182,0.85)";
  if (isTriad) return `rgba(${TRIAD_COLOR},${isTriadPlaying && !isActiveTriad ? 0.25 : 0.85})`;
  if (isActive) return noteData?.isRoot ? noteColor : noteDimColor;
  if (isInsideBracket) return "rgba(155,89,182,0.1)";
  return "var(--bg-fretboard)";
}

export function getNoteOutline(params: {
  isLickNote: boolean;
  isDoubleStop: boolean;
  isTriad: boolean;
  isTriadPlaying: boolean;
  isActiveTriad: boolean;
  isActive: boolean;
  showChordTones: boolean;
  noteData: any;
  hideScales: boolean;
}): string {
  const { isLickNote, isDoubleStop, isTriad, isTriadPlaying, isActiveTriad, isActive, showChordTones, noteData, hideScales } = params;
  if (isLickNote) return "2px solid #fbbf24";
  if (isDoubleStop) return "2px solid rgba(155,89,182,1)";
  if (isTriad) {
    return isTriadPlaying && !isActiveTriad
      ? `2px solid rgba(${TRIAD_COLOR},0.25)`
      : `2px solid rgba(${TRIAD_COLOR},1)`;
  }
  if (isActive && showChordTones && noteData?.isChordTone && !hideScales) {
    return "2px solid var(--text-primary)";
  }
  return "none";
}

export function getDisplayValue(params: {
  isLickNote: boolean;
  isActive: boolean;
  isDoubleStop: boolean;
  isTriad: boolean;
  showIntervals: boolean;
  showNotes: boolean;
  lickDegree: any;
  noteName: string;
  noteData: any;
  stringNumber: number;
  fret: number;
  keyName: string;
}): string {
  const { isLickNote, isActive, isDoubleStop, isTriad, showIntervals, showNotes, lickDegree, noteName, noteData, stringNumber, fret, keyName } = params;
  if (isLickNote && !isActive) return showIntervals ? lickDegree : showNotes ? noteName : "";
  if (isDoubleStop || isTriad) return showIntervals ? getDegree(stringNumber, fret, keyName) : showNotes ? noteName : "";
  if (isActive) return showIntervals ? noteData?.degree : showNotes ? noteName : "";
  return noteName;
}
