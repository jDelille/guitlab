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

const DrillFretboard = ({ selected, prefilled, onToggle, feedback, difficulty }: Props) => {
  const displayNotes = showNoteNames(difficulty);

  return (
    <>
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
    </>
  );
};

export default DrillFretboard;
