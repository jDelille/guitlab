import {
  withAlpha,
  type ChordNote,
  type ChordShape,
  type ShapeName,
} from "../../../constants/CagedChords";
import { SHAPE_COLORS } from "../constants";
import "./Chord.scss";

interface ChordProps {
  shape: ChordShape;
  active: string;
  setActive: (shape: ShapeName) => void;
}

export default function Chord({ shape, active, setActive }: ChordProps) {
  const DISPLAY_FRETS = 5;

  const color = SHAPE_COLORS[shape.shape];
  const dimColor = withAlpha(color, 0.55);

  // ✅ properly narrow to fretted notes only
  const fretted = shape.notes.filter(
    (n): n is ChordNote & { fret: number } => n.fret !== null,
  );

  const minFret = Math.min(...fretted.map((n) => n.fret));
  const maxFret = Math.max(...fretted.map((n) => n.fret));

  const range = maxFret - minFret + 1;
  const extra = Math.max(0, DISPLAY_FRETS - range);

  const leftPad = Math.floor(extra / 2);

  const startFret = Math.max(0, minFret - leftPad);

  const getNote = (stringIndex: number, fret: number) =>
    shape.notes.find((note) => {
      if (fret === 0 && note.fret === null) {
        return note.string === stringIndex;
      }

      return note.string === stringIndex && note.fret === fret;
    });

  const isActive = active === shape.shape;

  return (
    <div
      className="chord-grid"
      onClick={() => setActive(shape.shape)}
      style={{
        outline: isActive ? `2px solid ${color}` : undefined,
        opacity: isActive ? 1 : 0.4,
      }}
    >
      <div className="title">
        <p>{shape.shape} Shape</p>
        <p className="start-fret">Fret {startFret}</p>
      </div>

      {Array.from({ length: DISPLAY_FRETS }).map((_, fretOffset) => {
        const fret = startFret + fretOffset;

        return (
          <div key={fret} className="fret-row">
            <div className="fret-number">{fret}</div>

            {Array.from({ length: 6 }).map((_, stringIndex) => {
              const note = getNote(stringIndex, fret);

              return (
                <div
                  key={`${stringIndex}-${fret}`}
                  className="cell"
                  style={
                    fret === 0
                      ? { borderRight: "none", borderLeft: "none" }
                      : undefined
                  }
                >
                  {note && !note.isMuted && (
                    <>
                      {note.fret === 0 ? (
                        <div className="open" style={{ color }} />
                      ) : (
                        <div
                          className="dot"
                          style={{
                            backgroundColor: note.isRoot ? color : dimColor,
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
