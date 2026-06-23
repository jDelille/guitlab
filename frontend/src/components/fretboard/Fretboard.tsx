"use client";

import { useRef, useState, useEffect } from "react";
import type { ChordNote } from "../../constants/CagedChords";
import { type ShapeName } from "../../constants/CagedChords";
import { SHAPE_ROOT_FRETS } from "../../constants/shapeRootFrets";
import FretNumbers from "./FretNumbers";
import DoubleStopOverlay from "./DoubleStopOverlay";
import {
  useShapeNoteMaps,
  useLickNoteMap,
  useDoubleStops,
  useTriads,
} from "./useFretboardMaps";
import {
  NUT_WIDTH,
  playNote,
  getNoteName,
  toGradient,
  getNoteBackground,
  getNoteOutline,
  getDisplayValue,
  type NoteMapEntry,
} from "./fretboardUtils";
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

const STRINGS = Array.from({ length: 6 }, (_, i) => i);
const FRETS = Array.from({ length: 21 }, (_, i) => i);

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
  const fretboardRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const { allShapesNoteMap, selectedShapesNoteMap } = useShapeNoteMaps(
    keyName,
    scale,
    selectedShapes,
  );
  const lickNoteMap = useLickNoteMap(lickNotes);
  const {
    pairs: doubleStopPairs,
    map: doubleStopsMap,
    insideBracketSet,
  } = useDoubleStops(keyName, settings.showDoubleStops);
  const { map: triadsMap } = useTriads(
    keyName,
    cagedChord,
    settings.showTriads,
  );

  useEffect(() => {
    const el = fretboardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setContainerWidth(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rootFret = SHAPE_ROOT_FRETS[cagedChord as ShapeName]?.[keyName];
    if (rootFret === undefined) return;
    if (rootFret <= 2) {
      wrapper.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    const fretWidth = (wrapper.scrollWidth - NUT_WIDTH) / 20;
    wrapper.scrollTo({
      left: NUT_WIDTH + (rootFret - 2) * fretWidth,
      behavior: "smooth",
    });
  }, [cagedChord, keyName]);

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
    <div className="fretboard-wrapper" ref={wrapperRef}>
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
          <DoubleStopOverlay
            pairs={doubleStopPairs}
            containerWidth={containerWidth}
          />
        )}

        {STRINGS.map((stringNumber) => (
          <div
            key={stringNumber}
            className={!settings.flipFretboard ? "string" : "stringsFlipped"}
          >
            {FRETS.map((fret) => {
              const key = `${stringNumber}-${fret}`;
              const activeNote = activeMap.get(key) as NoteMapEntry | undefined;
              const isActive = !!activeNote;
              const lickNote = lickNoteMap.get(key);
              const isLickNote = !!lickNote;
              const isDoubleStop = doubleStopsMap.has(key);
              const isTriad = triadsMap.has(key);
              const isTriadPlaying =
                settings.showTriads && !!activePositions?.length;
              const isActiveTriad =
                isTriad &&
                !!activePositions?.some(
                  (p) => p.string === stringNumber && p.fret === fret,
                );
              const isInsideBracket =
                !isDoubleStop && insideBracketSet.has(key);
              const isHighlighted =
                (isActive || isLickNote || isDoubleStop || isTriad) &&
                !!activePositions?.some(
                  (p) => p.string === stringNumber && p.fret === fret,
                );

              const noteData = activeNote?.note;
              const noteColor = toGradient(activeNote?.colors ?? []);
              const noteDimColor = toGradient(activeNote?.dimColors ?? []);
              const noteName = getNoteName(stringNumber, fret);

              const styleParams = {
                isLickNote,
                isActive,
                isDoubleStop,
                isTriad,
                isTriadPlaying,
                isActiveTriad,
                isInsideBracket,
                noteData,
                noteColor,
                noteDimColor,
              };

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
                        background: getNoteBackground(styleParams),
                        outline: getNoteOutline({
                          ...styleParams,
                          showChordTones,
                          hideScales,
                        }),
                        outlineOffset: "2px",
                        cursor: "pointer",
                        boxShadow: isHighlighted
                          ? "0 0 0 2px var(--text-primary), 0 0 10px 2px rgba(255,255,255,0.6)"
                          : "none",
                      }}
                    >
                      {getDisplayValue({
                        isLickNote,
                        isActive,
                        isDoubleStop,
                        isTriad,
                        showIntervals: settings.showIntervals,
                        showNotes: settings.showNotes,
                        lickDegree: lickNote?.degree,
                        noteName,
                        noteData,
                        stringNumber,
                        fret,
                        keyName,
                      })}
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
