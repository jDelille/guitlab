import { useMemo } from "react";
import GuitarConstants from "../../constants/GuitarConstants";
import FretNumbers from "../fretboard/FretNumbers";
import "./DrillFretboard.scss";

interface Props {
  selected: Set<string>;
  onToggle: (key: string) => void;
  feedback: Map<string, "correct" | "wrong" | "missed"> | null;
}

const STANDARD_TUNING = GuitarConstants.tunings[0].tuning;
const NOTES = GuitarConstants.notesSharp;

function getNoteName(string: number, fret: number) {
  const open = STANDARD_TUNING[string];
  return NOTES[(open + fret) % 12];
}

const strings = Array.from({ length: 6 }, (_, i) => i);
const frets = Array.from({ length: 16 }, (_, i) => i);

const DrillFretboard = ({ selected, onToggle, feedback }: Props) => {
  return (
    <>
      <FretNumbers numberOfFrets={16} startFret={0} flipped={false} />
      <div className="drill-fretboard">
        {strings.map((stringNum) => (
          <div key={stringNum} className="drill-string">
            {frets.map((fret) => {
              const key = `${stringNum}-${fret}`;
              const isSelected = selected.has(key);
              const feedbackState = feedback?.get(key);

              return (
                <div className="drill-fret" key={key}>
                  <div className="noteBackground">
                    <div
                      className={`drill-note ${feedbackState ?? (isSelected ? "selected" : "")}`}
                      onClick={() => !feedback && onToggle(key)}
                    />
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

export default DrillFretboard;
