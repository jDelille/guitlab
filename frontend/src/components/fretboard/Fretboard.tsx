"use client";

import { useRef, useState, useEffect, useMemo } from "react";

import type { ChordNote, ShapeName } from "../../constants/CagedChords";
import { SHAPE_ROOT_FRETS } from "../../constants/shapeRootFrets";

import { useSettings } from "../../context/SettingsContext";
import { usePlayback } from "../../context/PlaybackContext";

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
  getKeyPitch,
  STANDARD_TUNING,
  type NoteMapEntry,
  playBend,
} from "./fretboardUtils";
import { pluckString, registerStringLine } from "./stringPluckAnimation";
import { bendString, registerStringPath } from "./stringBendAnimation";
import type { Lick } from "../../constants/licks/types";
import "./Fretboard.scss";
import type { LickTechnique } from "../../types/LickTechnique";
import { usePlayScale } from "../../hooks/usePlayScale";
import type { ActivePositions } from "../../pages/Home";

interface FretboardProps {
  cagedChord: ShapeName;
  selectedShapes: Set<ShapeName>;
  showChordTones: boolean;
  activePositions?: ActivePositions;
  setActivePositions: (positions: ActivePositions) => void;
  activeLick?: Lick | null;
}

const STRINGS = Array.from({ length: 6 }, (_, i) => {
  return i;
});
const FRETS = Array.from({ length: 21 }, (_, i) => {
  return i;
});

const STRING_THICKNESS = [1.5, 2.4, 2.5, 2.75, 3, 3.25];
const HIGH_STRING_INDEXES = new Set([0, 1, 2]);

const Fretboard = ({
  cagedChord,
  selectedShapes,
  showChordTones,
  activePositions,
  setActivePositions,
  activeLick,
}: FretboardProps) => {
  const { settings } = useSettings();
  const { currentBackingChord } = usePlayback();
  const fretboardRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef(new Map<string, HTMLElement>());

  const [containerWidth, setContainerWidth] = useState(0);
  const [bendingString, setBendingString] = useState<number | null>(null);
  const { allShapesNoteMap, selectedShapesNoteMap } = useShapeNoteMaps(
    settings.key,
    settings.scale,
    selectedShapes,
  );
  const lickNoteMap = useLickNoteMap(activeLick?.notes || null);

  const {
    pairs: doubleStopPairs,
    map: doubleStopsMap,
    insideBracketSet,
  } = useDoubleStops(settings.key, settings.scale, settings.showDoubleStops);

  const { map: triadsMap } = useTriads(
    settings.key,
    selectedShapes,
    settings.showTriads,
  );

  /**
   * Gets the width of the fretboard so the double stop overlay can
   * properly position itself on top of it.
   */
  useEffect(() => {
    const fretboardEl = fretboardRef.current;
    if (!fretboardEl) {
      return;
    }
    const resizeObserver = new ResizeObserver(([resizeEntry]) => {
      setContainerWidth(resizeEntry.contentRect.width);
    });
    resizeObserver.observe(fretboardEl);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  /**
   * Scrolls the fretboard so the selected shape's root fret is in view
   * whenever the shape or key changes.
   */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }
    const rootFret = SHAPE_ROOT_FRETS[cagedChord as ShapeName]?.[settings.key];
    if (rootFret === undefined) {
      return;
    }
    if (rootFret <= 2) {
      wrapper.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    const fretWidth = (wrapper.scrollWidth - NUT_WIDTH) / 20;
    wrapper.scrollTo({
      left: NUT_WIDTH + (rootFret - 2) * fretWidth,
      behavior: "smooth",
    });
  }, [cagedChord, settings.key]);

  /**
   * Works out which pitch classes belong to the current backing chord, so
   * matching notes on the fretboard can be highlighted as chord tones.
   */
  const chordTonePitches = useMemo(() => {
    if (!currentBackingChord) {
      return null;
    }
    const keyPitch = getKeyPitch(settings.key);
    if (keyPitch === -1) {
      return null;
    }
    const rootPitch = (keyPitch + currentBackingChord.offset) % 12;
    const intervals =
      currentBackingChord.quality === "major" ? [0, 4, 7] : [0, 3, 7];
    return new Set(
      intervals.map((interval) => {
        return (rootPitch + interval) % 12;
      }),
    );
  }, [currentBackingChord, settings.key]);

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

  const lickNotes = activeLick?.notes ?? null;

  const bendMap = useMemo(() => {
    const map = new Map<string, LickTechnique>();

    if (!activeLick) return map;

    Object.entries(activeLick.techniques ?? {}).forEach(
      ([index, technique]) => {
        const note = activeLick.notes[Number(index)];

        if (note) {
          map.set(`${note.string}-${note.fret}`, technique);
        }
      },
    );

    return map;
  }, [activeLick]);

  const handleBendAnimation = (
    pos: { string: number; fret: number } | null,
  ) => {
    if (!pos) return;

    setBendingString(pos.string);

    const element = noteRefs.current.get(`${pos.string}-${pos.fret}`);

    if (element) {
      bendString(pos.string, element);
    }

    // reset after the bend animation duration
    setTimeout(() => {
      setBendingString(null);
    }, 500);
  };

  usePlayScale({
    cagedChord,
    selectedShapes,
    selectedLickId: activeLick?.id ?? null,
    setActivePositions,
    onBend: handleBendAnimation,
  });

  return (
    <div className="fretboard-wrapper" id="tour-fretboard" ref={wrapperRef}>
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

        {STRINGS.map((stringNumber) => {
          return (
            <div
              key={stringNumber}
              className={!settings.flipFretboard ? "string" : "stringsFlipped"}
            >
              <div
                className="string-line"
                ref={(el) => {
                  registerStringLine(stringNumber, el);
                }}
                style={{
                  height: `${STRING_THICKNESS[stringNumber]}px`,
                  backgroundColor: HIGH_STRING_INDEXES.has(stringNumber)
                    ? "var(--high-string-color)"
                    : "var(--low-string-color)",
                  opacity: bendingString === stringNumber ? 0 : 1,
                }}
              />
              <svg
                className="string-bend-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  pointerEvents: "none",
                  overflow: "visible",
                  opacity: bendingString === stringNumber ? 1 : 0,
                }}
              >
                <path
                  ref={(el) => registerStringPath(stringNumber, el)}
                  stroke={
                    HIGH_STRING_INDEXES.has(stringNumber)
                      ? "var(--high-string-color)"
                      : "var(--low-string-color)"
                  }
                  strokeWidth={STRING_THICKNESS[stringNumber]}
                  fill="none"
                />
              </svg>
              {FRETS.map((fret) => {
                const key = `${stringNumber}-${fret}`;
                const activeNote = activeMap.get(key) as
                  | NoteMapEntry
                  | undefined;
                const isActive = !!activeNote;
                const lickNote = lickNoteMap.get(key);
                const isLickNote = !!lickNote;
                const isDoubleStop = doubleStopsMap.has(key);
                const isTriad = triadsMap.has(key);
                const isTriadPlaying =
                  settings.showTriads && !!activePositions?.length;
                const isActiveTriad =
                  isTriad &&
                  !!activePositions?.some((pos) => {
                    return pos.string === stringNumber && pos.fret === fret;
                  });
                const isDoubleStopPlaying =
                  settings.showDoubleStops && !!activePositions?.length;
                const isActiveDoubleStop =
                  isDoubleStop &&
                  !!activePositions?.some((pos) => {
                    return pos.string === stringNumber && pos.fret === fret;
                  });
                const isInsideBracket =
                  !isDoubleStop && insideBracketSet.has(key);
                const isHighlighted =
                  (isActive || isLickNote || isDoubleStop || isTriad) &&
                  !!activePositions?.some((pos) => {
                    return pos.string === stringNumber && pos.fret === fret;
                  });

                const noteData = activeNote?.note;
                const noteColor = toGradient(activeNote?.colors ?? []);
                const noteDimColor = toGradient(activeNote?.dimColors ?? []);
                const noteName = getNoteName(stringNumber, fret);
                const notePitch = (STANDARD_TUNING[stringNumber] + fret) % 12;
                const isChordTone =
                  isActive && !!chordTonePitches?.has(notePitch);

                const triadEntry = triadsMap.get(key);
                const triadColors = triadEntry?.colors ?? [];
                const triadDimColors = triadEntry?.dimColors ?? [];
                const triadColor = toGradient(triadColors);
                const triadDimColor = toGradient(triadDimColors);

                const styleParams = {
                  isLickNote,
                  isActive,
                  isDoubleStop,
                  isDoubleStopPlaying,
                  isActiveDoubleStop,
                  isTriad,
                  isTriadPlaying,
                  isActiveTriad,
                  isInsideBracket,
                  noteData,
                  noteColor,
                  noteDimColor,
                  triadColor,
                  triadDimColor,
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
                        ref={(el) => {
                          if (el) {
                            noteRefs.current.set(key, el);
                          }
                        }}
                        onClick={(e) => {
                          const technique = bendMap.get(
                            `${stringNumber}-${fret}`,
                          );

                          console.log(technique, "TECHNIQUE");

                          if (
                            technique?.technique === "bend" &&
                            technique.bend
                          ) {
                            playBend(
                              stringNumber,
                              fret,
                              technique.bend.amount,
                              technique.bend.duration,
                            );
                          } else {
                            playNote(stringNumber, fret);
                          }

                          pluckString(stringNumber);

                          if (technique?.technique === "bend") {
                            bendString(
                              stringNumber,
                              e.currentTarget as HTMLElement,
                            );
                          }
                        }}
                        style={{
                          background: getNoteBackground(styleParams),
                          outline: getNoteOutline({
                            ...styleParams,
                            showChordTones,
                            hideScales,
                            triadOutlineColor: triadColors[0],
                            triadDimOutlineColor: triadDimColors[0],
                          }),
                          outlineOffset: "2px",
                          cursor: "pointer",
                          boxShadow: isHighlighted
                            ? "0 0 0 2px var(--bg-fretboard), 0 0 0 4px var(--text-primary), 0 0 10px 2px rgba(255,255,255,0.6)"
                            : isChordTone
                              ? "0 0 0 2px #f59e0b, 0 0 6px 2px rgba(245,158,11,0.45)"
                              : "none",
                        }}
                      >
                        {getDisplayValue({
                          isLickNote,
                          isActive,
                          isDoubleStop,
                          isTriad,
                          showDegrees: settings.showDegrees,
                          showNotes: settings.showNotes,
                          lickDegree: lickNote?.degree,
                          noteName,
                          noteData,
                          stringNumber,
                          fret,
                          keyName: settings.key,
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Fretboard;
