import { useRef } from "react";
import GuitarConstants from "../../constants/GuitarConstants";
import FretNumbers from "../fretboard/FretNumbers";
import { getInstrument } from "../../audio/soundfont";
import "./ChordFinderFretboard.scss";

const MIDI_TUNING = [64, 59, 55, 50, 45, 40];
const STANDARD_TUNING = GuitarConstants.tunings[0].tuning;
const NOTES = GuitarConstants.notesSharp;

const STRINGS = Array.from({ length: 6 }, (_, i) => i);
const FRETS = Array.from({ length: 16 }, (_, i) => i);

function getNoteName(str: number, fret: number) {
  return NOTES[(STANDARD_TUNING[str] + fret) % 12];
}

async function playNote(str: number, fret: number) {
  const instrument = await getInstrument();
  instrument.start({ note: MIDI_TUNING[str] + fret });
}

interface Props {
  selected: Map<number, number>;
  onChange: (next: Map<number, number>) => void;
}

export default function ChordFinderFretboard({ selected, onChange }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClick = (str: number, fret: number) => {
    const next = new Map(selected);
    if (next.get(str) === fret) {
      next.delete(str);
    } else {
      next.set(str, fret);
      playNote(str, fret);
    }
    onChange(next);
  };

  return (
    <div className="cf-fretboard-wrapper" ref={wrapperRef}>
      <FretNumbers numberOfFrets={16} startFret={0} flipped={false} />
      <div className="cf-fretboard">
        {STRINGS.map((str) => (
          <div key={str} className="cf-string">
            {FRETS.map((fret) => {
              const isSelected = selected.get(str) === fret;
              const noteName = getNoteName(str, fret);
              return (
                <div className="cf-fret" key={fret}>
                  <div className="noteBackground">
                    <div
                      className={`cf-note${isSelected ? " cf-note--selected" : ""}`}
                      onClick={() => handleClick(str, fret)}
                    >
                      {noteName}
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
}
