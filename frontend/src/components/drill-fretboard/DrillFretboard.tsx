import { useRef, useEffect, useMemo } from "react";
import GuitarConstants from "../../constants/GuitarConstants";
import FretNumbers from "../fretboard/FretNumbers";
import { getInstrument } from "../../audio/soundfont";
import "./DrillFretboard.scss";

const MIDI_TUNING = [64, 59, 55, 50, 45, 40];

async function playNote(stringNum: number, fret: number) {
  const instrument = await getInstrument();
  instrument.start({ note: MIDI_TUNING[stringNum] + fret });
}

interface Props {
  selected: Set<string>;
  prefilled: Set<string>;
  onToggle: (key: string) => void;
  feedback: Map<string, "correct" | "wrong" | "missed"> | null;
  difficulty: string;
  correctPositions: Set<string>;
}

const STANDARD_TUNING = GuitarConstants.tunings[0].tuning;
const NOTES = GuitarConstants.notesSharp;

function getNoteName(stringNum: number, fret: number) {
  const open = STANDARD_TUNING[stringNum];
  return NOTES[(open + fret) % 12];
}

const strings = Array.from({ length: 6 }, (_, i) => i);
const frets = Array.from({ length: 16 }, (_, i) => i);

const showNoteNames = (difficulty: string) =>
  ["Novice", "Intermediate", "Advanced", "Expert"].includes(difficulty);

// Fret 0 column is fixed at 75px; frets 1-15 share the remaining width equally
const FRET_ZERO_WIDTH = 75;
const FRET_WIDTH = (1856 - FRET_ZERO_WIDTH) / 15;

const DrillFretboard = ({ selected, prefilled, onToggle, feedback, difficulty }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const displayNotes = showNoteNames(difficulty);

  const minPrefilledFret = useMemo(() => {
    if (prefilled.size === 0) return 0;
    return Math.min(...Array.from(prefilled).map(k => parseInt(k.split("-")[1])));
  }, [prefilled]);

  useEffect(() => {
    if (!wrapperRef.current || minPrefilledFret <= 2) return;
    // Scroll so there's one fret of visual padding to the left of the first note
    const scrollX = FRET_ZERO_WIDTH + (minPrefilledFret - 1) * FRET_WIDTH;
    wrapperRef.current.scrollTo({ left: scrollX, behavior: "smooth" });
  }, [minPrefilledFret]);

  return (
    <div className="drill-fretboard-wrapper" ref={wrapperRef}>
      <FretNumbers numberOfFrets={16} startFret={0} flipped={false} />
      <div className="drill-fretboard">
        {strings.map((stringNum) => (
          <div key={stringNum} className="drill-string">
            {frets.map((fret) => {
              const key = `${stringNum}-${fret}`;
              const isSelected = selected.has(key);
              const isPrefilled = prefilled.has(key);
              const feedbackState = feedback?.get(key);
              const noteName = getNoteName(stringNum, fret);
              const handleClick = () => { if (!feedback) { playNote(stringNum, fret); onToggle(key); } };

              return (
                <div className="drill-fret" key={key}>
                  <div className="noteBackground">
                    {isPrefilled && !feedbackState ? (
                      <div className="drill-note prefilled" onClick={() => playNote(stringNum, fret)} />
                    ) : displayNotes && !isSelected && !feedbackState ? (
                      <div className="drill-note-name" onClick={handleClick}>
                        {noteName}
                      </div>
                    ) : (
                      <div
                        className={`drill-note ${feedbackState ?? (isSelected ? "selected" : "")}`}
                        onClick={handleClick}
                      />
                    )}
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

export default DrillFretboard;
