"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import type { ChordNote } from "../../constants/CagedChords";
import { getInstrument } from "../../audio/soundfont";
import {
  getShapesForKey,
  withAlpha,
  type ShapeName,
} from "../../constants/CagedChords";
import { SHAPE_COLORS } from "../chords/constants";
import GuitarConstants from "../../constants/GuitarConstants";
import { getDoubleStopsForKey } from "../../constants/doubleStops";
import { getTriadsForKey, type CagedShape } from "../../constants/triads";
import FretNumbers from "./FretNumbers";
import type { Scales } from "../../types/Scales";
import "./Fretboard.scss";

interface FretboardProps {
  keyName: string;
  scale: string;
  cagedChord: string;
  selectedShapes: Set<ShapeName>;
  showChordTones: boolean;
  settings: any;
  activePositions?: { string: number; fret: number }[] | null;
  lickNotes?: ChordNote[] | null;
}

const NOTES = GuitarConstants.notesSharp;
const STANDARD_TUNING = GuitarConstants.tuning[0];
const MIDI_TUNING = [64, 59, 55, 50, 45, 40];

const TRIAD_COLOR = "39,174,96";

const NUT_WIDTH = 75;
const STRING_ROW_H = 35;
const NOTE_RADIUS = 12.5;

function getFretCenterX(fret: number, containerW: number): number {
  const fw = (containerW - NUT_WIDTH) / 20;
  return fret === 0 ? NUT_WIDTH / 2 : NUT_WIDTH + (fret - 0.5) * fw;
}

function getStringCenterY(stringIndex: number): number {
  return stringIndex * STRING_ROW_H + STRING_ROW_H / 2;
}

async function playNote(string: number, fret: number) {
  const instrument = await getInstrument();
  instrument.start({ note: MIDI_TUNING[string] + fret });
}

function getNoteName(string: number, fret: number) {
  const open = STANDARD_TUNING[string];
  return NOTES[(open + fret) % 12];
}

const DEGREE_LABELS: Record<number, string> = {
  0: "R",
  1: "b2",
  2: "2",
  3: "b3",
  4: "3",
  5: "4",
  6: "b5",
  7: "5",
  8: "b6",
  9: "6",
  10: "b7",
  11: "7",
};

function getDegree(string: number, fret: number, keyName: string): string {
  const notePitch = (STANDARD_TUNING[string] + fret) % 12;
  const rootPitch =
    NOTES.indexOf(keyName) !== -1
      ? NOTES.indexOf(keyName)
      : GuitarConstants.notesFlat.indexOf(keyName);
  if (rootPitch === -1) return "";
  return DEGREE_LABELS[(notePitch - rootPitch + 12) % 12] ?? "";
}

const Fretboard = ({
  keyName,
  scale,
  cagedChord,
  selectedShapes,
  showChordTones,
  settings,
  activePositions,
  lickNotes,
}: FretboardProps) => {
  const shape = getShapesForKey(keyName)[cagedChord as ShapeName];

  const color = SHAPE_COLORS[shape.shape];
  const dimColor = withAlpha(color, 0.55);

  const strings = Array.from({ length: 6 }, (_, i) => i);
  const frets = Array.from({ length: 21 }, (_, i) => i);

  const chordToneKeys = useMemo(() => {
    const keys = new Set<string>();

    shape.notes
      .filter((n) => !n.isMuted && n.fret !== null)
      .forEach((n) => {
        const flippedString = 5 - n.string;
        keys.add(`${flippedString}-${n.fret}`);
        if (n.fret! + 12 <= 20) {
          keys.add(`${flippedString}-${n.fret! + 12}`);
        }
      });

    return keys;
  }, [shape]);

  const noteMap = useMemo(() => {
    const map = new Map<
      string,
      (typeof shape)[Scales][0] & { isChordTone: boolean }
    >();

    const scaleNotes = shape[scale as Scales];

    scaleNotes.forEach((note) => {
      const key = `${note.string}-${note.fret}`;

      map.set(key, {
        ...note,
        isChordTone: chordToneKeys.has(key),
      });
    });

    return map;
  }, [shape, scale, chordToneKeys]);

  const allShapesNoteMap = useMemo(() => {
    const allShapes = getShapesForKey(keyName);
    const shapeOrder: ShapeName[] = ["C", "A", "G", "E", "D"];

    const intermediate = new Map<
      string,
      { note: any; entries: { color: string; dimColor: string; effectiveBaseFret: number }[] }
    >();

    shapeOrder.forEach((shapeName) => {
      const shapeColor = SHAPE_COLORS[shapeName];
      const dim = withAlpha(shapeColor, 0.55);
      const baseFret = allShapes[shapeName].baseFret;
      allShapes[shapeName][scale as Scales].forEach((note) => {
        const key = `${note.string}-${note.fret}`;
        // Extensions are 12 frets above the base shape, so treat them as sitting one cycle higher
        const effectiveBaseFret = note.isOctaveExtension ? baseFret + 12 : baseFret;
        const existing = intermediate.get(key);
        if (existing) {
          existing.entries.push({ color: shapeColor, dimColor: dim, effectiveBaseFret });
        } else {
          intermediate.set(key, { note, entries: [{ color: shapeColor, dimColor: dim, effectiveBaseFret }] });
        }
      });
    });

    // Sort each note's colors by effective fret position (left = closer to nut, right = higher up neck)
    const map = new Map<string, { note: any; colors: string[]; dimColors: string[] }>();
    intermediate.forEach((value, key) => {
      const sorted = [...value.entries].sort((a, b) => a.effectiveBaseFret - b.effectiveBaseFret);
      map.set(key, {
        note: value.note,
        colors: sorted.map((e) => e.color),
        dimColors: sorted.map((e) => e.dimColor),
      });
    });

    return map;
  }, [keyName, scale]);

  const selectedShapesNoteMap = useMemo(() => {
    const allShapes = getShapesForKey(keyName);
    const shapeOrder: ShapeName[] = ["C", "A", "G", "E", "D"];

    const intermediate = new Map<
      string,
      { note: any; entries: { color: string; dimColor: string; effectiveBaseFret: number }[] }
    >();

    shapeOrder.filter((s) => selectedShapes.has(s)).forEach((shapeName) => {
      const shapeColor = SHAPE_COLORS[shapeName];
      const dim = withAlpha(shapeColor, 0.55);
      const baseFret = allShapes[shapeName].baseFret;
      allShapes[shapeName][scale as Scales].forEach((note) => {
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

    const map = new Map<string, { note: any; colors: string[]; dimColors: string[] }>();
    intermediate.forEach((value, key) => {
      const sorted = [...value.entries].sort((a, b) => a.effectiveBaseFret - b.effectiveBaseFret);
      map.set(key, {
        note: value.note,
        colors: sorted.map((e) => e.color),
        dimColors: sorted.map((e) => e.dimColor),
      });
    });

    return map;
  }, [keyName, scale, selectedShapes]);

  const lickNoteMap = useMemo(() => {
    const map = new Map<string, ChordNote>();
    if (!lickNotes) return map;
    lickNotes
      .filter((n) => n.fret !== null)
      .forEach((n) => map.set(`${n.string}-${n.fret}`, n));
    return map;
  }, [lickNotes]);

  const fretboardRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = fretboardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setContainerWidth(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const doubleStopPairs = useMemo(() => {
    if (!settings.showDoubleStops) return [];
    return getDoubleStopsForKey(keyName);
  }, [keyName, settings.showDoubleStops]);

  const doubleStopsMap = useMemo(() => {
    const map = new Map<string, number>();
    doubleStopPairs.forEach(({ strings, frets }, idx) => {
      map.set(`${strings[0]}-${frets[0]}`, idx + 1);
      map.set(`${strings[1]}-${frets[1]}`, idx + 1);
    });
    return map;
  }, [doubleStopPairs]);

  const triadPositions = useMemo(() => {
    if (!settings.showTriads) return [];
    return getTriadsForKey(keyName, cagedChord as CagedShape);
  }, [keyName, cagedChord, settings.showTriads]);

  const triadsMap = useMemo(() => {
    const set = new Set<string>();
    triadPositions.forEach(({ strings, frets }) => {
      [0, 1, 2].forEach((i) => set.add(`${strings[i]}-${frets[i]}`));
    });
    return set;
  }, [triadPositions]);

  const insideBracketSet = useMemo(() => {
    const set = new Set<string>();
    doubleStopPairs.forEach(({ strings, frets }) => {
      const minStr = Math.min(strings[0], strings[1]);
      const maxStr = Math.max(strings[0], strings[1]);
      const minFret = Math.min(frets[0], frets[1]);
      const maxFret = Math.max(frets[0], frets[1]);
      for (let s = minStr; s <= maxStr; s++) {
        for (let f = minFret; f <= maxFret; f++) {
          set.add(`${s}-${f}`);
        }
      }
    });
    return set;
  }, [doubleStopPairs]);

  const showAll = settings.showAllCagedScales;
  const hideScales =
    (settings.showDoubleStops &&
      !showAll &&
      !settings.showScaleWithDoubleStops) ||
    (settings.showTriads && !showAll);

  const activeMap = showAll
    ? allShapesNoteMap
    : hideScales
      ? new Map()
      : selectedShapesNoteMap;

  return (
    <div className="fretboard-wrapper">
      <FretNumbers
        numberOfFrets={21}
        startFret={0}
        flipped={settings.flipFretboard}
      />

      <div
        className={!settings.flipStrings ? "fretboard" : "fretboardFlipped"}
        ref={fretboardRef}
        style={{ position: "relative" }}
      >
        {settings.showDoubleStops && containerWidth > 0 && (
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              overflow: "visible",
              zIndex: 2,
            }}
          >
            {doubleStopPairs.map(
              ({ strings: pairStrings, frets: pairFrets }, idx) => {
                const x1 = getFretCenterX(pairFrets[0], containerWidth);
                const y1 = getStringCenterY(pairStrings[0]);
                const x2 = getFretCenterX(pairFrets[1], containerWidth);
                const y2 = getStringCenterY(pairStrings[1]);
                const cx = (x1 + x2) / 2;
                const cy = (y1 + y2) / 2;
                const dx = x2 - x1;
                const dy = y2 - y1;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const capsuleLen = length + NOTE_RADIUS * 2 + 6;
                const capsuleThick = NOTE_RADIUS * 2 + 8;
                return (
                  <rect
                    key={idx}
                    x={-capsuleLen / 2}
                    y={-capsuleThick / 2}
                    width={capsuleLen}
                    height={capsuleThick}
                    rx={capsuleThick / 2}
                    ry={capsuleThick / 2}
                    fill="rgba(155,89,182,0.1)"
                    stroke="rgba(155,89,182,0.65)"
                    strokeWidth={1.5}
                    transform={`translate(${cx}, ${cy}) rotate(${angle})`}
                  />
                );
              },
            )}
          </svg>
        )}
        {strings.map((stringNumber) => (
          <div
            key={stringNumber}
            className={!settings.flipFretboard ? "string" : "stringsFlipped"}
          >
            {frets.map((fret) => {
              const key = `${stringNumber}-${fret}`;
              const activeNote = activeMap.get(key);
              const isActive = !!activeNote;

              const lickNote = lickNoteMap.get(key);
              const isLickNote = !!lickNote;
              const dsPairIndex = doubleStopsMap.get(key);
              const isDoubleStop = dsPairIndex !== undefined;
              const isTriad = triadsMap.has(key);
              const isTriadPlaying =
                settings.showTriads &&
                activePositions != null &&
                activePositions.length > 0;
              const isActiveTriad =
                isTriad &&
                activePositions?.some(
                  (p) => p.string === stringNumber && p.fret === fret,
                );
              const isInsideBracket =
                !isDoubleStop && insideBracketSet.has(key);
              const noteName = getNoteName(stringNumber, fret);
              const noteData = (activeNote as any)?.note;
              const noteColors: string[] = (activeNote as any)?.colors ?? [];
              const noteDimColors: string[] = (activeNote as any)?.dimColors ?? [];
              const noteColor = noteColors.length > 1
                ? `linear-gradient(to right, ${noteColors.map((c, i) => `${c} ${i * (100 / noteColors.length)}%, ${c} ${(i + 1) * (100 / noteColors.length)}%`).join(", ")})`
                : noteColors[0];
              const noteDimColor = noteDimColors.length > 1
                ? `linear-gradient(to right, ${noteDimColors.map((c, i) => `${c} ${i * (100 / noteDimColors.length)}%, ${c} ${(i + 1) * (100 / noteDimColors.length)}%`).join(", ")})`
                : noteDimColors[0];

              const displayValue =
                isLickNote && !isActive
                  ? settings.showIntervals
                    ? lickNote!.degree
                    : settings.showNotes
                      ? noteName
                      : ""
                  : isDoubleStop
                    ? settings.showIntervals
                      ? getDegree(stringNumber, fret, keyName)
                      : settings.showNotes
                        ? noteName
                        : ""
                    : isTriad
                      ? settings.showIntervals
                        ? getDegree(stringNumber, fret, keyName)
                        : settings.showNotes
                          ? noteName
                          : ""
                      : isActive
                        ? settings.showIntervals
                          ? noteData?.degree
                          : settings.showNotes
                            ? noteName
                            : ""
                        : noteName;

              return (
                <div className="fret" key={key}>
                  <div className="noteBackground">
                    <div
                      className={
                        noteData?.degree ||
                        (isLickNote && !isActive) ||
                        isDoubleStop ||
                        isTriad
                          ? "note"
                          : "ghost-note"
                      }
                      onClick={() => playNote(stringNumber, fret)}
                      style={{
                        background:
                          isLickNote && !isActive
                            ? "rgba(251,191,36,0.15)"
                            : isDoubleStop
                              ? "rgba(155,89,182,0.85)"
                              : isTriad
                                ? `rgba(${TRIAD_COLOR},${isTriadPlaying && !isActiveTriad ? 0.25 : 0.85})`
                                : isActive
                                  ? noteData?.isRoot
                                    ? noteColor
                                    : noteDimColor
                                  : isInsideBracket
                                    ? "rgba(155,89,182,0.1)"
                                    : "var(--bg-fretboard)",
                        outline: isLickNote
                          ? "2px solid #fbbf24"
                          : isDoubleStop
                            ? "2px solid rgba(155,89,182,1)"
                            : isTriad
                              ? isTriadPlaying && !isActiveTriad
                                ? `2px solid rgba(${TRIAD_COLOR},0.25)`
                                : `2px solid rgba(${TRIAD_COLOR},1)`
                              : isActive && showChordTones && noteData?.isChordTone && !hideScales
                                ? "2px solid var(--text-primary)"
                                : "none",
                        outlineOffset: "2px",
                        cursor: "pointer",
                        boxShadow:
                          (isActive || isLickNote || isDoubleStop || isTriad) &&
                          activePositions?.some((p) => p.string === stringNumber && p.fret === fret)
                            ? "0 0 0 2px var(--text-primary), 0 0 10px 2px rgba(255,255,255,0.6)"
                            : "none",
                      }}
                    >
                      {displayValue}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fretboard;
