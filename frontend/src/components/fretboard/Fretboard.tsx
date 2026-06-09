"use client";

import { useMemo } from "react";
import { useGuitarStore } from "../../store/store";
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
  showAll: boolean;
  showChordTones: boolean;
}

const NOTES = GuitarConstants.notesSharp;
const STANDARD_TUNING = GuitarConstants.tunings[0].tuning;

function getNoteName(string: number, fret: number) {
  const open = STANDARD_TUNING[string];
  return NOTES[(open + fret) % 12];
}

const Fretboard = ({
  keyName,
  scale,
  cagedChord,
  showAll,
  showChordTones,
}: FretboardProps) => {
  const { isStringsFlipped, isFretboardFlipped } = useGuitarStore();

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

    shape[scale as Scales].forEach((note) => {
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

  const activeMap = showAll ? allShapesNoteMap : noteMap;

  console.log("chord tones:", [...chordToneKeys]);
  console.log(
    "scale notes:",
    shape[scale as Scales].map((n) => `${n.string}-${n.fret}`),
  );

  return (
    <>
      <div className={!isStringsFlipped ? "fretboard" : "fretboardFlipped"}>
        {strings.map((stringNumber) => (
          <div
            key={stringNumber}
            className={!isFretboardFlipped ? "string" : "stringsFlipped"}
          >
            {frets.map((fret) => {
              const key = `${stringNumber}-${fret}`;
              const activeNote = activeMap.get(key);
              const isActive = !!activeNote;

              const noteName = getNoteName(stringNumber, fret);

              const noteData = showAll ? (activeNote as any)?.note : activeNote;
              const noteColor = showAll ? (activeNote as any)?.color : color;
              const noteDimColor = showAll
                ? (activeNote as any)?.dimColor
                : dimColor;

              return (
                <div className="fret" key={key}>
                  <div className="noteBackground">
                    <div
                      className={noteData?.degree ? "note" : "ghost-note"}
                      style={{
                        backgroundColor: isActive
                          ? noteData?.isRoot
                            ? noteColor
                            : noteDimColor
                          : "#080808",
                        outline:
                          isActive && showChordTones && noteData?.isChordTone
                            ? `2px solid white`
                            : "none",
                        outlineOffset: "2px",
                      }}
                    >
                      {isActive ? noteData?.degree : noteName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <FretNumbers numberOfFrets={21} startFret={0} />
    </>
  );
};

export default Fretboard;
