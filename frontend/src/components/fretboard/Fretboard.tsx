"use client";

import { useMemo } from "react";
import { useGuitarStore } from "../../store/store";
import type { ChordNote } from "../../constants/CagedChords";
import { getInstrument } from "../../audio/soundfont";
import {
  getShapesForKey,
  withAlpha,
  type ShapeName,
} from "../../constants/CagedChords";
import { SHAPE_COLORS } from "../chords/constants";
import GuitarConstants from "../../constants/GuitarConstants";
import FretNumbers from "./FretNumbers";
import type { Scales } from "../../types/Scales";
import "./Fretboard.scss";

interface FretboardProps {
  keyName: string;
  scale: string;
  cagedChord: string;
  showChordTones: boolean;
  settings: any;
  activePosition?: { string: number; fret: number } | null;
  lickNotes?: ChordNote[] | null;
}

const NOTES = GuitarConstants.notesSharp;
const STANDARD_TUNING = GuitarConstants.tunings[0].tuning;
const TRIAD_DEGREES = ["R", 3, 5];
const MIDI_TUNING = [64, 59, 55, 50, 45, 40];

async function playNote(string: number, fret: number) {
  const instrument = await getInstrument();
  instrument.start({ note: MIDI_TUNING[string] + fret });
}

function getNoteName(string: number, fret: number) {
  const open = STANDARD_TUNING[string];
  return NOTES[(open + fret) % 12];
}

const Fretboard = ({
  keyName,
  scale,
  cagedChord,
  showChordTones,
  settings,
  activePosition,
  lickNotes,
}: FretboardProps) => {
  const shape = getShapesForKey(keyName)[cagedChord as ShapeName];

  const color = SHAPE_COLORS[shape.shape];
  const dimColor = withAlpha(color, 0.25);

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

    const filteredNotes = settings.showTriads
      ? scaleNotes.filter((n) => TRIAD_DEGREES.includes(n.degree as any))
      : scaleNotes;

    filteredNotes.forEach((note) => {
      const key = `${note.string}-${note.fret}`;

      map.set(key, {
        ...note,
        isChordTone: chordToneKeys.has(key),
      });
    });



    return map;
  }, [shape, scale, chordToneKeys]);

  const allShapesNoteMap = useMemo(() => {
    const map = new Map<
      string,
      { note: any; color: string; dimColor: string }
    >();

    const shapeOrder: ShapeName[] = ["C", "A", "G", "E", "D"];

    shapeOrder.forEach((shapeName) => {
      const shapeData = getShapesForKey(keyName)[shapeName];
      const shapeColor = SHAPE_COLORS[shapeName];
      const dim = withAlpha(shapeColor, 0.25);

      shapeData[scale as Scales].forEach((note) => {
        const key = `${note.string}-${note.fret}`;
        if (!map.has(key)) {
          map.set(key, { note, color: shapeColor, dimColor: dim });
        }
      });
    });

    return map;
  }, [keyName, scale]);

  const lickNoteMap = useMemo(() => {
    const map = new Map<string, ChordNote>();
    if (!lickNotes) return map;
    lickNotes.filter(n => n.fret !== null).forEach(n => map.set(`${n.string}-${n.fret}`, n));
    return map;
  }, [lickNotes]);

  const showAll = settings.showAllCagedScales;

  const activeMap = showAll ? allShapesNoteMap : noteMap;

  return (
    <>
      <FretNumbers numberOfFrets={21} startFret={0} flipped={settings.flipFretboard} />

      <div className={!settings.flipStrings ? "fretboard" : "fretboardFlipped"}>
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
              const noteName = getNoteName(stringNumber, fret);
              const noteData = showAll ? (activeNote as any)?.note : activeNote;
              const noteColor = showAll ? (activeNote as any)?.color : color;
              const noteDimColor = showAll
                ? (activeNote as any)?.dimColor
                : dimColor;

              const displayValue = isLickNote && !isActive
                ? (settings.showIntervals ? lickNote!.degree : settings.showNotes ? noteName : "")
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
                      className={noteData?.degree || (isLickNote && !isActive) ? "note" : "ghost-note"}
                      onClick={() => playNote(stringNumber, fret)}
                      style={{
                        backgroundColor: isLickNote && !isActive
                          ? "rgba(251,191,36,0.15)"
                          : isActive
                            ? noteData?.isRoot
                              ? noteColor
                              : noteDimColor
                            : "#080808",
                        outline:
                          isLickNote
                            ? "2px solid #fbbf24"
                            : isActive && showChordTones && noteData?.isChordTone
                              ? "2px solid var(--text-primary)"
                              : "none",
                        outlineOffset: "2px",
                        cursor: "pointer",
                        boxShadow:
                          (isActive || isLickNote) &&
                          activePosition != null &&
                          stringNumber === activePosition.string &&
                          fret === activePosition.fret
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
    </>
  );
};

export default Fretboard;
